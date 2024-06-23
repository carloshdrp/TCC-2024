import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentAccessToken } from "../redux/slices/authSlice";

export const PrivateRoutes = () => {
  const user = useSelector(selectCurrentAccessToken);
  return user ? <Outlet /> : <Navigate to="/login" />;
};
