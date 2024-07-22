import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    setNotifications: (state, action) => action.payload,
    addNotification: (state, action) => {
      state.unshift(action.payload);
    },
    markAsRead: (state, action) => {
      const notification = state.find((n) => n.id === action.payload);
      if (notification) notification.readAt = new Date().toISOString();
    },
  },
});

export const { setNotifications, addNotification, markAsRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
