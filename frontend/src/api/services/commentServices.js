import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../config";

export const getComments = createAsyncThunk(
  "comment/getComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/comments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createComment = createAsyncThunk(
  "comment/createComment",
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/comments`, commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getComment = createAsyncThunk(
  "comment/getComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/comments/${commentId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
