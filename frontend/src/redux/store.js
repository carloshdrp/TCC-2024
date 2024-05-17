import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "../api/apiSlice";
import authReducer from "./slices/authSlice";
import forumNavigatorReducer from "./slices/forumNavigatorSlice";
import quizCreateReducer from "./slices/quizCreateSlice";
import quizMenuReducer from "./slices/quizMenuSlice";
import quizPracticeReducer from "./slices/quizPraticeSlice";

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
    quizMenu: quizMenuReducer,
    quizPractice: quizPracticeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
