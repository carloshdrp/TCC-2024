import { apiSlice } from "../apiSlice";

export const ratingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRatings: builder.query({
      query: (filter, options) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/ratings?${params}`;
      },
    }),
    getRating: builder.query({
      query: (id) => `/ratings/${id}`,
    }),
    getRatingByUserId: builder.query({
      query: (userId) => `/ratings/user/${userId}`,
    }),
    getRatingByRateableId: builder.query({
      query: (rateableId) => `/ratings/rateable/${rateableId}`,
    }),
    getRatingByRateableType: builder.query({
      query: (rateableType) => `/ratings/type/${rateableType}`,
    }),
    createRating: builder.mutation({
      query: (rating) => ({
        url: "/ratings",
        method: "POST",
        body: rating,
      }),
      invalidatesTags: ["League"],
    }),
    deleteRating: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/ratings/${id}`,
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: ["League"],
    }),
  }),
});

export const {
  useGetRatingsQuery,
  useGetRatingQuery,
  useGetRatingByUserIdQuery,
  useGetRatingByRateableIdQuery,
  useGetRatingByRateableTypeQuery,
  useCreateRatingMutation,
  useDeleteRatingMutation,
} = ratingApiSlice;
