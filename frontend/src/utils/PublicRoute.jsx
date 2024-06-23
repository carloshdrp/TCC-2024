import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentAccessToken } from "../redux/slices/authSlice";

export const PublicRoutes = () => {
  const user = useSelector(selectCurrentAccessToken);

  return user ? <Navigate to="/profile" /> : <Outlet />;
};
