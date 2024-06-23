import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser, setUser } from "../redux/slices/authSlice";
import { notification } from "antd";
import { API_URL } from "../config";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-tokens",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult?.data) {
          api.dispatch(
            setUser({
              accessToken: refreshResult.data.access.token,
              refreshToken: refreshResult.data.refresh.token,
            }),
          );
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logoutUser());
        }
      } catch (error) {
        api.dispatch(logoutUser());
      }
    } else {
      api.dispatch(logoutUser());
    }
  } else if (result?.error?.status === 429) {
    notification.error({
      type: "error",
      message: "Erro de limitação de taxa!",
      description:
        "Você atingiu o limite de solicitações ao servidor. Tente novamente mais tarde.",
    });
    throw new Error("Erro de limitação de taxa!");
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
