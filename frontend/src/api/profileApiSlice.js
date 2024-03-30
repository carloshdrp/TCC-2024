import { apiSlice } from "./apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (userId) => `/users/${userId}`,
      keepUnusedDataFor: 5,
    }),
    getRanking: builder.query({
      query: (userId) => `/users/ranking/${userId}`,
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useGetRankingQuery, useUpdateUserMutation } =
  profileApiSlice;
