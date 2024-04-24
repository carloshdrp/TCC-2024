import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "../api/apiSlice";
import authReducer from "./slices/authSlice";
import forumNavigatorReducer from "./slices/forumNavigatorSlice";
import quizCreateReducer from "./slices/quizCreateSlice";

const persistConfig = {
  key: "authData",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistedAuthReducer,
    forumNavigator: forumNavigatorReducer,
    quizCreate: quizCreateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
