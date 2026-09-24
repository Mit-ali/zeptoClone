export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
  },
  cart: {
    getAll: "/carts",
    getById: (id: string | number) => `/carts/${id}`,
    create: "/carts",
    update: (id: string | number) => `/carts/${id}`,
    delete: (id: string | number) => `/carts/${id}`,
  },
  products: {
    getAll: "/products",
  }
} as const;
