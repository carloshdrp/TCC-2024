import axios from "axios";
import store from "../redux";
import { refreshTokens } from "./authSlice";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await store.dispatch(refreshTokens());
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);
