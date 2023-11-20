import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../config";

export const getPosts = createAsyncThunk(
  "post/getPosts",
  async () => (await axios.get(`${API_URL}/posts`)).data
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (post) => (await axios.post(`${API_URL}/posts`, post)).data
);

export const getPost = createAsyncThunk(
  "post/getPost",
  async (postId) => (await axios.get(`${API_URL}/posts/${postId}`)).data
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async (post) => (await axios.patch(`${API_URL}/posts/${post._id}`, post)).data
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId) => (await axios.delete(`${API_URL}/posts/${postId}`)).data
);
