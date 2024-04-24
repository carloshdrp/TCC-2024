import { apiSlice } from "../apiSlice";

export const quizApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: (filter, options) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/quiz?${params}`;
      },
    }),
    getQuiz: builder.query({
      query: (id) => `/quiz/${id}`,
    }),
    createQuiz: builder.mutation({
      query: (quiz) => ({
        url: "/quiz",
        method: "POST",
        body: quiz,
      }),
    }),
    updateQuiz: builder.mutation({
      query: ({ id, quiz }) => ({
        url: `/quiz/${id}`,
        method: "PATCH",
        body: quiz,
      }),
    }),
    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: `/quiz/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetQuizQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = quizApiSlice;
