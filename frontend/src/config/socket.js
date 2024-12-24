import io from "socket.io-client";
import { API_URL } from "./index.js";
import { logoutUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux"; 

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

export const initNotificationSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_URL, {
    withCredentials: true,
    autoConnect: false,
  });

  socket.auth = { token };

  socket.on("connect", () => {
    socket.emit("authenticate", token);
    reconnectAttempts = 0;
  });

  socket.on("authentication_error", (error) => {
    if (error === "Sessão expirada") {
      const dispatch = useDispatch();

      dispatch(logoutUser());
      socket.disconnect();
    }
  });

  socket.on("connect_error", () => {
    reconnectAttempts++;
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      const dispatch = useDispatch();

      dispatch(logoutUser());
      socket.disconnect();
    }
  });

  socket.connect();

  return socket;
};

export const disconnectNotificationSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getNotificationSocket = () => socket;
