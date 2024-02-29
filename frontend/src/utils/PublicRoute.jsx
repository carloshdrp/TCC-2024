import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { selectCurrentToken } from "../redux/slices/authSlice";

export const PublicRoutes = () => {
  const user = useSelector(selectCurrentToken);

  return user ? <Navigate to="/profile" /> : <Outlet />;
};
