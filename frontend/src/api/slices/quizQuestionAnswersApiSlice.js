import { apiSlice } from "../apiSlice.js";

export const quizQuestionAnswersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizQuestionAnswers: builder.query({
      query: (filter, options) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/quiz-questions/answer?${params}`;
      },
    }),
    createQuizQuestionAnswer: builder.mutation({
      query: ({ choice, quizQuestionId, quizAttemptId }) => ({
        url: `/quiz-questions/answer?questionId=${quizQuestionId}&attemptId=${quizAttemptId}`,
        method: "POST",
        body: {
          choice,
        },
      }),
    }),
    deleteQuizQuestionAnswer: builder.mutation({
      query: ({ quizQuestionId }) => ({
        url: `/quiz-questions/answer/${quizQuestionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetQuizQuestionAnswersQuery,
  useCreateQuizQuestionAnswerMutation,
  useDeleteQuizQuestionAnswerMutation,
} = quizQuestionAnswersApiSlice;
