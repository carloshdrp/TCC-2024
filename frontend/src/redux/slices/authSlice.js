import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authServices from "../../api/services/authServices";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authServices.loginUser(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Inicial state
const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      authServices.logoutUser();
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { logoutUser, setUser } = authSlice.actions;

export default authSlice.reducer;
