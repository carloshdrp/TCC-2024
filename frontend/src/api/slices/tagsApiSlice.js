import { apiSlice } from "../apiSlice";

export const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query({
      query: () => "/tags",
    }),
    getTag: builder.query({
      query: (id) => `/tags/${id}`,
    }),
    createTag: builder.mutation({
      query: (name) => ({
        url: "/tags",
        method: "POST",
        body: name,
      }),
    }),
    updateTag: builder.mutation({
      query: ({ id, name }) => ({
        url: `/tags/${id}`,
        method: "PATCH",
        body: name,
      }),
    }),
    deleteTag: builder.mutation({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetTagQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsApiSlice;
