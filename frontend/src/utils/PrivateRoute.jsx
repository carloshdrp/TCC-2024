import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { selectCurrentToken } from "../redux/slices/authSlice";

export const PrivateRoutes = () => {
  const user = useSelector(selectCurrentToken);
  return user ? <Outlet /> : <Navigate to="/login" />;
};
