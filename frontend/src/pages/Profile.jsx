import LayoutComponent from "./layout/LayoutComponent.jsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { useGetUsersQuery } from "../api/profileApiSlice";

function Profile() {
  const user = useSelector(selectCurrentUser);
  const { data: userData, error, isLoading } = useGetUsersQuery(user.id);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  let content;
  if (isLoading) {
    content = <p>Carregando...</p>;
  } else if (error) {
    content = <p>Erro: {error}</p>;
  } else if (userData) {
    content = <p>{JSON.stringify(userData, null, 2)}</p>;
  }

  return <LayoutComponent>{content}</LayoutComponent>;
}

export default Profile;
