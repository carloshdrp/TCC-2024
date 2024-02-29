import { apiSlice } from "../apiSlice";

export const avatarApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: ({ avatarFile }) => ({
        url: "/auth/avatar",
        method: "PUT",
        body: avatarFile,
      }),
    }),
    deleteAvatar: builder.mutation({
      query: (avatarPath) => ({
        url: "/auth/avatar",
        method: "DELETE",
        body: { avatarPath },
      }),
    }),
  }),
});

export const { useUpdateAvatarMutation, useDeleteAvatarMutation } =
  avatarApiSlice;
