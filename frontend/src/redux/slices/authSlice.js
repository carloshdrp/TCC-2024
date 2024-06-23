import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "../../api/slices/authApiSlice.js";

const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  accessToken: null,
  refreshToken: null,
  stayConnected: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, accessToken, refreshToken, stayConnected } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.stayConnected = stayConnected;
    },
    updateUserState(state, action) {
      if (action.payload) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = null;
      }
    },
    logoutUser(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApiSlice.endpoints.loginUser.matchPending, (state) => {
        state.status = "loading";
      })
      .addMatcher(
        authApiSlice.endpoints.loginUser.matchFulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          state.accessToken = action.payload.tokens.access.token;
          state.refreshToken = action.payload.tokens.refresh.token;
        },
      )
      .addMatcher(
        authApiSlice.endpoints.loginUser.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        },
      )
      .addMatcher(authApiSlice.endpoints.registerUser.matchPending, (state) => {
        state.status = "loading";
      })
      .addMatcher(
        authApiSlice.endpoints.registerUser.matchFulfilled,
        (state) => {
          state.status = "succeeded";
        },
      )
      .addMatcher(
        authApiSlice.endpoints.registerUser.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        },
      );
  },
});

export const { setUser, updateUserState, logoutUser, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentAccessToken = (state) => state.auth.accessToken;
export const selectCurrentRefreshToken = (state) => state.auth.refreshToken;
