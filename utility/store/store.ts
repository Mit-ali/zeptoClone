import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { encryptTransform } from "redux-persist-transform-encrypt"
import userReducer from "./features/UserSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
const secretKey = process.env.NEXT_PUBLIC_REDUX_PERSIST_SECRET_KEY
if (!secretKey) {
  throw new Error("Missing NEXT_PUBLIC_REDUX_PERSIST_SECRET_KEY in .env.local")
}
const encryptor = encryptTransform({
  secretKey: secretKey,
  onError: function (error: Error) {
    console.error("redux-persist-transform-encrypt error:", error)
  },
})

const userPersistConfig = {
  key: "user",
  storage,
  transforms: [encryptor],
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
