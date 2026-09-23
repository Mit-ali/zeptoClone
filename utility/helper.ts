"use client"
import { store } from "@/utility/store"
import cookies from "react-cookies"
import toast from "react-hot-toast"
export const setCookies = (
  name: string,
  value: string | object,
  expiry?: number
) => {
  const expires = new Date()
  expires.setDate(expires.getDate() + (expiry || 0))
  cookies.save(name, value, {
    path: "/",
    expires: expiry ? expires : undefined, // set expiration
    secure: true, // set true if using HTTPS
    sameSite: "lax",
  })
}
export const getCookies = (name: string) => {
  return cookies.load(name)
}
export const deleteCookies = (name: string) => {
  cookies.remove(name, { path: "/" })
}

export const getSession = () => {
  return cookies.load(process.env.NEXT_PUBLIC_BUSINESS + "session")
}

export const setNewSessionCookie = (value: string) => {
  const sessionCookie = getSession()
  if (sessionCookie) deleteCookies(process.env.NEXT_PUBLIC_BUSINESS + "session")
  setCookies(process.env.NEXT_PUBLIC_BUSINESS + "session", value)
}

export const getToken = () => {
  return cookies.load(process.env.NEXT_PUBLIC_BUSINESS + "token")
}
export const logoutUser = () => {
  store.dispatch({ type: "SAVE_USER_DATA", payload: null })
  deleteCookies(process.env.NEXT_PUBLIC_BUSINESS + "token")
  deleteCookies(process.env.NEXT_PUBLIC_BUSINESS + "refreshToken")
  deleteCookies(process.env.NEXT_PUBLIC_BUSINESS + "session")
  localStorage.clear()
  showToastNotification("success", "logout successfully")
  window.location.href = "/"
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
      // react-hot-toast doesn't have "danger" alias — use error
      return toast.error(message, commonOptions)

    case "warning":
      return toast(message, {
        ...commonOptions,
        icon: "⚠️",
      })

    case "info":
      // info — use a plain toast or use a custom icon if you want
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
