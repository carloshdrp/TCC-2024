import { apiSlice } from "../apiSlice";

export const quizRelationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizRelation: builder.query({
      query: (filter, options) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/quiz-relations?${params}`;
      },
    }),
    createQuizRelation: builder.mutation({
      query: (relation) => ({
        url: "/quiz-relations",
        method: "POST",
        body: relation,
      }),
    }),
    deleteQuizRelation: builder.mutation({
      query: (id) => ({
        url: `/quiz-relations/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetQuizRelationQuery,
  useCreateQuizRelationMutation,
  useDeleteQuizRelationMutation,
} = quizRelationApiSlice;
