"use client"

import React, { useEffect, useRef, useState } from "react"
import { Provider, useDispatch } from "react-redux"
import { throttle } from "lodash"
import { saveState } from "@/utility/LocalStorage"
import { Toaster } from "react-hot-toast"
import { PersistGate } from "redux-persist/integration/react"
import { store, AppDispatch, persistor } from "."
import { saveUserData } from "./actions/action"
import { getToken } from "@/utility/helper"
import ScrollToTop from "@/utility/ScrollToTop"

function InnerProviders({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const hasFetched = useRef(false)
  const token = getToken()

  // const userDetails = useSelector(
  //   (state: RootState) => state.root.userDetails
  // );
  useEffect(() => {
    if (!token) return
    const navEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming
    const isReload = navEntry?.type === "reload"
    if (isReload && !hasFetched.current) {
      hasFetched.current = true
      dispatch(saveUserData())
    }
  }, [dispatch, token])
  // useEffect(() => {
  //   if (token && !userDetails && !hasFetched.current) {
  //     hasFetched.current = true;
  //     dispatch(saveUserData())
  //   }
  // }, [token, userDetails, dispatch]);

  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const throttledSave = throttle(() => {
      const state = storeRef.current.getState().root
      saveState({ root: state })
    }, 300)

    const unsubscribe = storeRef.current.subscribe(throttledSave)

    return () => {
      unsubscribe()
      throttledSave.cancel()
    }
  }, [isClient])

  if (!isClient) return null

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          containerStyle={{ zIndex: 999999 }}
          toastOptions={{ style: { zIndex: 999999 } }}
        />
        <ScrollToTop />
        <InnerProviders>{children}</InnerProviders>
      </PersistGate>
    </Provider>
  )
}
