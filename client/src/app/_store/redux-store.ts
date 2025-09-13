import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import authReducer from "./authSlice"
import cartCheckoutReducer from "./cartCheckoutSlice";

const persistConfig = {
  key: "auth",
  storage,
}

const cartCheckoutPersistConfig = {
  key: "cartCheckout",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer)
const persistedCartCheckoutReducer = persistReducer(cartCheckoutPersistConfig, cartCheckoutReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    cartCheckout: persistedCartCheckoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch