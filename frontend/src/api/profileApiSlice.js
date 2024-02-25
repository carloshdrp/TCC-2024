import { apiSlice } from "./apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (userId) => `/users/${userId}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetUsersQuery } = profileApiSlice;
