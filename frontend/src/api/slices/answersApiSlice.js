import { apiSlice } from "../apiSlice";

export const answersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnswersByQuestionId: builder.query({
      query: (questionId) => `/answers/question/${questionId}`,
    }),
    getAnswer: builder.query({
      query: (id) => `/answers/${id}`,
    }),
    createAnswer: builder.mutation({
      query: (answer) => ({
        url: "/answers",
        method: "POST",
        body: answer,
      }),
    }),
    updateAnswer: builder.mutation({
      query: ({ id, answer }) => ({
        url: `/answers/${id}`,
        method: "PATCH",
        body: answer,
      }),
    }),
    deleteAnswer: builder.mutation({
      query: (id) => ({
        url: `/answers/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAnswersByQuestionIdQuery,
  useGetAnswerQuery,
  useCreateAnswerMutation,
  useUpdateAnswerMutation,
  useDeleteAnswerMutation,
} = answersApiSlice;
