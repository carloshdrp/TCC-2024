import { apiSlice } from "../apiSlice";

export const tagsRelationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTagsRelation: builder.query({
      query: () => "/tags-relation",
    }),
    getTagRelation: builder.query({
      query: (id) => `/tags-relation/${id}`,
    }),
    createTagRelation: builder.mutation({
      query: (tagRelation) => ({
        url: "/tags-relation",
        method: "POST",
        body: tagRelation,
      }),
    }),
    updateTagRelation: builder.mutation({
      query: ({ id, tagRelation }) => ({
        url: `/tags-relation/${id}`,
        method: "PATCH",
        body: tagRelation,
      }),
    }),
    deleteTagRelation: builder.mutation({
      query: (id) => ({
        url: `/tags-relation/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTagsRelationQuery,
  useGetTagRelationQuery,
  useCreateTagRelationMutation,
  useUpdateTagRelationMutation,
  useDeleteTagRelationMutation,
} = tagsRelationApiSlice;
