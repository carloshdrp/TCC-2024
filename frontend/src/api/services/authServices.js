import axios from "axios";
import { API_URL } from "../../config";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/auth/login`, loginData);
  // Armazenar os tokens recebidos localmente, por exemplo, em localStorage
  localStorage.setItem("accessToken", response.data.tokens.access.token);
  localStorage.setItem("refreshToken", response.data.tokens.refresh.token);
  return response.data;
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  await axios.post(`${API_URL}/auth/logout`, { refreshToken });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const refreshTokens = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await axios.post(`${API_URL}/auth/refresh-tokens`, {
    refreshToken,
  });
  localStorage.setItem("accessToken", response.data.tokens.access.token);
  localStorage.setItem("refreshToken", response.data.tokens.refresh.token);
  return response.data;
};

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
