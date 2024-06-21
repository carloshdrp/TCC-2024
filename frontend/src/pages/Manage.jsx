import { useEffect } from "react";
import LayoutComponent from "./layout/LayoutComponent.jsx";
import { Navigator } from "../components/Manage/Navigator.jsx";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice.js";
import { useGetUsersQuery } from "../api/slices/profileApiSlice.js";
import { useNavigate } from "react-router-dom";

const Manage = () => {
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUsersQuery(user.id);

  useEffect(() => {
    if (userData?.role !== "ADMIN") {
      navigate("/");
    }
  }, [userData]);

  return (
    <LayoutComponent>
      <div className="text-text">
        <Navigator />
      </div>
    </LayoutComponent>
  );
};

export default Manage;
