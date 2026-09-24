import { getToken, logoutUser } from '../helper';

type RequestConfig = RequestInit & {
  json?: unknown;
  retries?: number;
  retryDelay?: number;
  multipart?: boolean;
};

type Interceptor<T> = (value: T) => T | Promise<T>;
type ErrorHandler = (error: unknown) => unknown;

interface InterceptorManager<T> {
  use(fulfilled: Interceptor<T>, rejected?: ErrorHandler): number;
  eject(id: number): void;
  handlers: Array<{
    fulfilled: Interceptor<T>;
    rejected?: ErrorHandler;
  } | null>;
}

export interface IApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown,
    public originalError?: Error
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

const authExcludedUrls = [
  'login',
  'forgot',
  'sign-up',
  'reset-password',
  'logout',
];

const isAuthExcluded = (endpoint: string): boolean => {
  return authExcludedUrls.some((pattern) =>
    endpoint.includes(pattern)
  );
};


const createInterceptorManager = <T>(): InterceptorManager<T> => {
  const handlers: InterceptorManager<T>['handlers'] = [];

  return {
    handlers,

    use(fulfilled, rejected) {
      handlers.push({ fulfilled, rejected });
      return handlers.length - 1;
    },

    eject(id) {
      if (handlers[id]) {
        handlers[id] = null;
      }
    },
  };
};


const executeInterceptors = async <T>(
  manager: InterceptorManager<T>,
  value: T
): Promise<T> => {
  let result = value;

  for (const handler of manager.handlers) {
    if (!handler) continue;

    try {
      result = await handler.fulfilled(result);
    } catch (error) {
      if (handler.rejected) {
        result = await handler.rejected(error) as T;
      } else {
        throw error;
      }
    }
  }

  return result;
};


const fetchWithRetry = async (
  url: string,
  config: RequestConfig
): Promise<Response> => {
  const retries = config.retries ?? 0;
  const retryDelay = config.retryDelay ?? 1000;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, config);

      if (
        response.status >= 500 &&
        attempt < retries
      ) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            retryDelay * Math.pow(2, attempt)
          )
        );

        continue;
      }

      return response;
    } catch (error) {

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            retryDelay * Math.pow(2, attempt)
          )
        );

        continue;
      }

      throw error;
    }
  }

  throw new Error('Unreachable code');
};



const handleResponse = async <T>(
  response: Response
): Promise<T> => {
  if (!response.ok) {
    throw response;
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  if (contentType?.includes('text/')) {
    return response.text() as unknown as T;
  }

  if (
    contentType?.includes('octet-stream') ||
    contentType?.includes('image/')
  ) {
    return response.blob() as unknown as T;
  }

  return response.arrayBuffer() as unknown as T;
};


const handleError = async (
  error: unknown,
  url: string
): Promise<never> => {
  if (error instanceof TypeError) {
    throw new ApiError(
      0,
      'Network error - failed to connect to server',
      null,
      error
    );
  }

  if (error instanceof Response) {
    if (
      error.status === 401 &&
      !isAuthExcluded(url)
    ) {
      logoutUser();

      throw new ApiError(
        401,
        'Session expired',
        {
          message:
            'Session expired - please login again',
        }
      );
    }

    let errorData: unknown;

    try {
      errorData = await error.json();
    } catch {
      errorData = {
        message: 'Failed to parse server error',
      };
    }

    throw new ApiError(
      error.status,
      error.statusText,
      errorData
    );
  }

  throw new ApiError(
    500,
    'Unknown error occurred',
    null,
    error as Error
  );
};

const createApiClient = (
  baseURL: string =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8000'
) => {
  const interceptors = {
    request: createInterceptorManager<RequestConfig>(),
    response: createInterceptorManager<Response>(),
  };

  const request = async <T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> => {
    const urlObj = new URL(`${baseURL}${endpoint}`);

    const method = options.method || 'GET';


    if (
      ['GET', 'HEAD'].includes(method) &&
      options.json
    ) {
      const data =
        options.json as Record<string, unknown>;

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          urlObj.searchParams.append(
            key,
            String(value)
          );
        }
      });
    }


    let config: RequestConfig = {
      ...options,
      headers: {
        ...options.headers,
      },
      cache: 'no-store',
    };


    if (!isAuthExcluded(endpoint)) {
      const token = getToken();

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }


    if (
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) &&
      config.json
    ) {
      if (
        config.multipart &&
        config.json instanceof FormData
      ) {
        config.body = config.json;


      } else {
        config.headers = {
          ...config.headers,
          'Content-Type': 'application/json',
        };

        config.body = JSON.stringify(config.json);
      }
    }


    config = await executeInterceptors(
      interceptors.request,
      config
    );

    const url = urlObj.toString();

    try {


      const response = await fetchWithRetry(
        url,
        config
      );


      const finalResponse =
        await executeInterceptors(
          interceptors.response,
          response
        );


      return await handleResponse<T>(
        finalResponse
      );
    } catch (error) {
      return handleError(error, url);
    }
  };


  const get = <T>(
    endpoint: string,
    options?: Omit<RequestConfig, 'method' | 'json'> & {
      json?: Record<string, unknown>;
    }
  ) => {
    return request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  };

  const post = <T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<RequestConfig, 'method' | 'json'>
  ) => {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      json: data,
    });
  };

  const put = <T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<RequestConfig, 'method' | 'json'>
  ) => {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      json: data,
    });
  };

  const patch = <T>(
    endpoint: string,
    data?: unknown,
    options?: Omit<RequestConfig, 'method' | 'json'>
  ) => {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      json: data,
    });
  };

  const remove = <T>(
    endpoint: string,
    options?: Omit<RequestConfig, 'method' | 'json'>
  ) => {
    return request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  };


  return {
    request,
    get,
    post,
    put,
    patch,
    delete: remove,
    interceptors,
  };
};

export const api = createApiClient();

export { createApiClient };