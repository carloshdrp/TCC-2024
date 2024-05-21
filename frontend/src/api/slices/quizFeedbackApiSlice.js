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
      query: ({ quizId, score }) => ({
        url: `/quiz/feedback/?quizId=${quizId}`,
        method: "POST",
        body: { score },
      }),
    }),

    getQuizFeedback: builder.query({
      query: (quizId) => `/quiz/feedback/?quizId=${quizId}`,
    }),

    getQuizFeedbackById: builder.query({
      query: (feedbackId) => `/quiz/feedback/${feedbackId}`,
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
  useGetQuizFeedbackByIdQuery,
  useDeleteQuizFeedbackMutation,
} = quizFeedbackApiSlice;
