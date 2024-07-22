import { apiSlice } from "../apiSlice.js";
import { logoutUser, setUser } from "../../redux/slices/authSlice.js";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: ({ loginData, stayConnected }) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...loginData, stayConnected },
      }),
    }),
    logoutUser: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/logout",
        method: "POST",
        body: { refreshToken },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutUser());
        } catch (error) {
          throw new Error("Erro logout user: " + error.message);
        }
      },
    }),
    refreshTokens: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/refresh-tokens",
        method: "POST",
        body: { refreshToken },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const { auth } = getState();

          dispatch(
            setUser({
              ...auth,
              accessToken: data.access.token,
              refreshToken: data.refresh.token,
            }),
          );
        } catch (error) {
          dispatch(logoutUser());
        }
      },
    }),
    verifyToken: builder.mutation({
      query: (token) => ({
        url: "/auth/verify-token",
        method: "POST",
        body: { token },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshTokensMutation,
  useVerifyTokenMutation,
} = authApiSlice;
