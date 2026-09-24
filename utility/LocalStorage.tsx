"use client"
import { RootState } from "@/utility/store/store"
export const loadState = () => {
  if (typeof window === "undefined") return
  try {
    const serializedState = localStorage.getItem("state")
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (error) {
    console.error(error)
    return undefined
  }
}
export const saveState = (state: RootState) => {
  if (typeof window === "undefined") return undefined
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem("state", serializedState)
  } catch (error) {
    console.error(error)
  }
}
