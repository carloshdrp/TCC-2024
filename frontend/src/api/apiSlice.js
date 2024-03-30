import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, logoutUser } from "../redux/slices/authSlice";
import { message } from "antd";
import { API_URL } from "../config";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      "/auth/refresh-tokens",
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      const user = api.getState().auth.user;

      api.dispatch(setUser({ ...refreshResult.data, user }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logoutUser());
      message.error("Sua sessão expirou, faça login novamente.");
      return;
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});

// https://www.youtube.com/watch?v=-JJFQ9bkUbo
