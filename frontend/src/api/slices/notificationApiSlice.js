import { apiSlice } from "../apiSlice";

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `/notification`,
    }),
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notification/${notificationId}/read`,
        method: "PATCH",
      }),
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: "/notification/read-all",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApiSlice;
