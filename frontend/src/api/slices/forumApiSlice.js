import { apiSlice } from "../apiSlice";

export const forumApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getForumQuestions: builder.query({
      query: (filter, options) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/questions?${params}`;
      },
    }),
    getForumQuestion: builder.query({
      query: (id) => `/questions/${id}`,
    }),
    createForumQuestion: builder.mutation({
      query: (question) => ({
        url: "/questions",
        method: "POST",
        body: question,
      }),
    }),
    updateForumQuestion: builder.mutation({
      query: ({ id, question }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: question,
      }),
    }),
    deleteForumQuestion: builder.mutation({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetForumQuestionsQuery,
  useGetForumQuestionQuery,
  useCreateForumQuestionMutation,
  useUpdateForumQuestionMutation,
  useDeleteForumQuestionMutation,
} = forumApiSlice;
