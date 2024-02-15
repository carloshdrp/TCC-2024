import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export const PublicRoutes = () => {
  const user = useSelector((state) => state.auth.user);

  return user ? <Navigate to="/" /> : <Outlet />;
};
