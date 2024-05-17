import { apiSlice } from "../apiSlice.js";

export const quizFeedbackApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizScore: builder.query({
      query: (quizId) => `/quiz/feedback/${quizId}/score`,
    }),

    getQuizzesFeedbacks: builder.query({
      query: (filter, options) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/quiz/feedback/?${params}`;
      },
    }),

    createQuizFeedback: builder.mutation({
      query: ({ quizId, feedback }) => ({
        url: `/quiz/feedback/?quizId=${quizId}`,
        method: "POST",
        body: feedback,
      }),
    }),

    getQuizFeedback: builder.query({
      query: (quizId) => `/quiz/feedback/?quizId=${quizId}`,
    }),
    deleteQuizFeedback: builder.mutation({
      query: ({ feedbackId }) => ({
        url: `/quiz/feedback/${feedbackId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetQuizScoreQuery,
  useCreateQuizFeedbackMutation,
  useGetQuizzesFeedbacksQuery,
  useGetQuizFeedbackQuery,
  useDeleteQuizFeedbackMutation,
} = quizFeedbackApiSlice;
