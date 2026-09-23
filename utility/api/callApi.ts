import { getSession, getToken } from "../helper"
import { store } from "@/store"

export interface IApiErrorResponse {
  message: string
  error?: string
  statusCode: number
}
type AuthExcludedEndpoint =
  "login" | "forgot" | "sign-up" | "reset-password" | "logout"
const authExcludedUrls: AuthExcludedEndpoint[] = [
  "login",
  "forgot",
  "sign-up",
  "reset-password",
  "logout",
]
type CallAPIOptions<D = any> = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD"
  headers?: HeadersInit
  cache?: RequestCache
  redirect?: RequestRedirect
  priority?: RequestPriority
  signal?: AbortSignal
  body?: BodyInit
  multipart?: boolean
} & (
  | { method: "GET" | "HEAD"; data?: Record<string, any> }
  | {
      method: "POST" | "PUT" | "PATCH" | "DELETE"
      data?: D
      multipart?: boolean
    }
)
export const callApi = async <T = any, D = any>(
  endpoint: string,
  options: CallAPIOptions<D>
): Promise<T> => {
  const url = new URL(`${endpoint}`)
  // const headers = new Headers(options.headers);
  const headers: Record<string, string> = {}

  // Handle incoming headers options
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value
      })
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value
      })
    } else {
      Object.assign(headers, options.headers)
    }
  }

  // Add authentication if required
  if (!isAuthExcluded(endpoint)) {
    const token = getToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
  }
  // Handle GET data as query params
  if (["GET", "HEAD"].includes(options.method) && options.data) {
    Object.entries(options.data).forEach(([key, value]) => {
      if (value !== undefined)
        url.searchParams.append(key, encodeURI(String(value)))
    })
  }
  // Handle request body
  let body: BodyInit | undefined
  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(options.method) &&
    options.data
  ) {
    if (options.multipart && options.data instanceof FormData) {
      body = options.data
    } else {
      headers["Content-Type"] = "application/json"
      body = JSON.stringify(options.data)
    }
  }
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    body,
    referrerPolicy: "strict-origin-when-cross-origin",
    cache: "no-store",
  }
  try {
    const response = await fetch(url.toString(), fetchOptions)
    return await handleResponse<T>(response)
  } catch (error) {
    return handleError<T>(error, url.toString())
  }
}
// Response handler with proper typing
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) throw response
  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    const data = await response.json()

    if (data && data.statusCode === 410) {
      window.location.href = "/plans"
      return new Promise(() => {})
    }

    return data as T
  }
  if (contentType?.includes("text/")) {
    return response.text() as Promise<T>
  }
  if (
    contentType?.includes("octet-stream") ||
    contentType?.includes("image/")
  ) {
    return response.blob() as Promise<T>
  }
  return response.arrayBuffer() as Promise<T>
}
// Enhanced error handling
const handleError = async <T>(error: unknown, url: string): Promise<T> => {
  if (error instanceof TypeError) {
    return {
      message: "Network error - failed to connect to server",
      statusCode: 0,
    } as unknown as T
  }
  if (error instanceof Response) {
    if (error.status === 401 && !isAuthExcluded(url)) {
      // logoutUser();
      store.dispatch({ type: "SAVE_SESSION_STATUS", payload: true })
      return {
        message: "Session expired - please login again",
        statusCode: 401,
      } as unknown as T
    }

    // if (error.status === 410) {
    //   window.location.href = "/plans";
    // }

    try {
      const errorData: IApiErrorResponse = await error.json()
      return errorData as unknown as T
    } catch {
      return {
        message: "Failed to parse server error",
        statusCode: error.status,
      } as unknown as T
    }
  }
  return {
    message: "Unknown error occurred",
    statusCode: 500,
  } as unknown as T
}
// Refresh token implementation
// const refreshToken = async (): Promise<string> => {
//   try {
//     const deviceToken = getCookies(
//       `${import.meta.env.NEXT_PUBLIC_APP_NAME}deviceToken`
//     );
//     const refreshToken = getCookies(
//       `${import.meta.env.NEXT_PUBLIC_APP_NAME}refreshToken`
//     );

//     const response = await callApi<RefreshTokenResponse>(
//       `${API_ENDPOINT.auth}refresh-token`,
//       {
//         method: "POST",
//         data: {
//           refreshToken,
//           deviceToken: deviceToken || "default-device-token",
//         },
//       }
//     );

//     setCookies(
//       `${import.meta.env.NEXT_PUBLIC_APP_NAME}token`,
//       response.accessToken
//     );
//     return response.accessToken;
//   } catch (error) {
//     // logoutUser();
//     throw new Error("Failed to refresh session - please login again");
//   }
// };

export const isAuthExcluded = (endpoint: string): boolean => {
  return authExcludedUrls.some((pattern) => endpoint.includes(pattern))
}
