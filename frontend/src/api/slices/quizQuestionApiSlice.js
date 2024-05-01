import { apiSlice } from "../apiSlice";

export const quizQuestionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizQuestions: builder.query({
      query: (filter, options, quizId) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/quiz-questions?quizId=${quizId}&${params}`;
      },
    }),
    getQuizQuestion: builder.query({
      query: (id) => `/quiz-questions/${id}`,
    }),
    createQuizQuestion: builder.mutation({
      query: ({ question, quizId }) => ({
        url: `/quiz-questions?quizId=${quizId}`,
        method: "POST",
        body: question,
      }),
    }),
    updateQuizQuestion: builder.mutation({
      query: ({ question, quizId, quizQuestionId }) => ({
        url: `/quiz-questions?quizId=${quizId}&quizQuestionId=${quizQuestionId}`,
        method: "PATCH",
        body: question,
      }),
    }),
    deleteQuizQuestion: builder.mutation({
      query: ({ quizId, quizQuestionId }) => ({
        url: `/quiz-questions?quizId=${quizId}&quizQuestionId=${quizQuestionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetQuizQuestionsQuery,
  useGetQuizQuestionQuery,
  useCreateQuizQuestionMutation,
  useUpdateQuizQuestionMutation,
  useDeleteQuizQuestionMutation,
} = quizQuestionApiSlice;
