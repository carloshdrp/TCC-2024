import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser, setUser } from "../redux/slices/authSlice";
import { notification } from "antd";
import { API_URL } from "../config";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = api.getState().auth.refreshToken;
      const stayConnected = api.getState().auth.stayConnected;

      if (refreshToken && stayConnected) {
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
                ...api.getState().auth,
                accessToken: refreshResult.data.access.token,
                refreshToken: refreshResult.data.refresh.token,
              }),
            );
            processQueue(null, refreshResult.data.access.token);
            result = await baseQuery(args, api, extraOptions);
          } else {
            processQueue(new Error("Failed to refresh token"), null);
            api.dispatch(logoutUser());
            notification.error({
              message: "Sessão Expirada",
              description:
                "Sua sessão expirou. Por favor, faça login novamente.",
            });
          }
        } catch (err) {
          processQueue(err, null);
          api.dispatch(logoutUser());
          notification.error({
            message: "Erro de Autenticação",
            description:
              "Ocorreu um erro ao renovar sua sessão. Por favor, faça login novamente.",
          });
        } finally {
          isRefreshing = false;
        }
      } else {
        api.dispatch(logoutUser());
        notification.warning({
          message: "Sessão Encerrada",
          description:
            "Sua sessão foi encerrada. Por favor, faça login novamente.",
        });
      }
    } else {
      try {
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        result = await baseQuery(args, api, extraOptions);
      } catch (err) {
        result = {
          error: {
            status: 401,
            data: err,
          },
        };
      }
    }
  }

  if (result?.error?.status === 403) {
    notification.error({
      message: "Acesso Negado",
      description: "Você não tem permissão para acessar este recurso.",
    });
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
