import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, logoutUser } from "../redux/slices/authSlice";
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
