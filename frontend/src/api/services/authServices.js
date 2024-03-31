import axios from "axios";
import { API_URL } from "../../config";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/auth/login`, loginData);
  return response.data;
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  await axios.post(`${API_URL}/auth/logout`, { refreshToken });
};

// export const refreshTokens = async () => {
//   const refreshToken = localStorage.getItem("refreshToken");
//   const response = await axios.post(`${API_URL}/auth/refresh-tokens`, {
//     refreshToken,
//   });
//   return response.data;
// };

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-token`, {
      token,
    });
    return response.data.valid;
  } catch (error) {
    return false;
  }
};
