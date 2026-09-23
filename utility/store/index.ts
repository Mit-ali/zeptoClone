import { combineReducers, configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers/reducer";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const secretKey = process.env.NEXT_PUBLIC_REDUX_PERSIST_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing NEXT_PUBLIC_REDUX_PERSIST_SECRET_KEY in environment variables");
  // During build or SSR on server, this might not be available depending on config.
  if (typeof window !== "undefined") {
    console.warn("Missing NEXT_PUBLIC_REDUX_PERSIST_SECRET_KEY in environment variables");
  }
}

const encryptor = encryptTransform({
  secretKey: secretKey || "fallback-key-during-ssr", // Fallback to avoid crash during SSR if key missing
  onError: function (error: Error) {
    console.error('redux-persist-transform-encrypt error:', error);
  },
});

const userPersistConfig = {
  key: "root",
  storage,
  transforms: [encryptor],
};

const rootReducer = combineReducers({
  root: persistReducer(userPersistConfig, reducers),
});
// const store = loadState();
export const store = configureStore({
  reducer: rootReducer,
  // preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
