import { apiSlice } from "../apiSlice";

export const achievementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetUserAchievement: builder.query({
      query: (userId) => `/users/${userId}/achievements`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetUserAchievementQuery } = achievementApiSlice;
