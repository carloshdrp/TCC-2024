import { apiSlice } from "../apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (userId) => `/users/${userId}`,
      keepUnusedDataFor: 5,
    }),
    getUser: builder.query({
      query: () => `/users`,
      keepUnusedDataFor: 5,
    }),
    getCount: builder.query({
      query: () => `/users/count`,
      keepUnusedDataFor: 5,
    }),
    getLeague: builder.query({
      query: (userId) => `/users/league/${userId}`,
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    removeUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetCountQuery,
  useGetLeagueQuery,
  useUpdateUserMutation,
  useRemoveUserMutation,
} = profileApiSlice;
