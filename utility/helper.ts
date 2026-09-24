"use client"
import { store } from "@/utility/store/store"
import toast from "react-hot-toast"

export const setCookies = (
  name: string,
  value: string | object,
  expiry?: number
) => {
  const expires = new Date()
  const stringValue = typeof value === "object" ? JSON.stringify(value) : value
  expires.setDate(expires.getDate() + (expiry || 0))
  if (typeof document !== "undefined") {
    document.cookie = `${name}=${encodeURIComponent(stringValue)}; path=/; expires=${expires.toUTCString()}; secure; samesite=lax`
  }
}

export const getCookies = (name: string) => {
  if (typeof document !== "undefined") {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(";").shift() || "")
    }
  }
  return undefined
}

export const deleteCookies = (name: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }
}

export const getToken = () => {
  return getCookies((process.env.NEXT_PUBLIC_BUSINESS || "") + "token")
}

export const logoutUser = () => {
  store.dispatch({ type: "SAVE_USER_DATA", payload: null })
  deleteCookies((process.env.NEXT_PUBLIC_BUSINESS || "") + "token")
  deleteCookies((process.env.NEXT_PUBLIC_BUSINESS || "") + "refreshToken")
  deleteCookies((process.env.NEXT_PUBLIC_BUSINESS || "") + "session")
  if (typeof localStorage !== "undefined") {
    localStorage.clear()
  }
  showToastNotification("success", "logout successfully")
  if (typeof window !== "undefined") {
    window.location.href = "/"
  }
}
export const showToastNotification = (
  type: "success" | "danger" | "info" | "default" | "warning",
  message: string
) => {
  const commonOptions = {
    position: "bottom-right" as const,
    duration: 2000,
  }

  switch (type) {
    case "success":
      return toast.success(message, commonOptions)

    case "danger":

      return toast.error(message, commonOptions)

    case "warning":
      return toast(message, {
        ...commonOptions,
        icon: "⚠️",
      })

    case "info":

      return toast(message, commonOptions)

    case "default":
    default:
      return toast(message, commonOptions)
  }
}
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
export const toCamelCase = (s: string) =>
  s
    .replace(/ (\w)/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toLowerCase())

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
