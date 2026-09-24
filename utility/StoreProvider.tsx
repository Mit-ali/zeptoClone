"use client"

import { Provider } from "react-redux"
import { store, persistor } from "@/utility/store/store"
import { PersistGate } from "redux-persist/integration/react"
import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


export default function StoreProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}
