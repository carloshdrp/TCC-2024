import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginComponent from "../components/LoginComponent.jsx";
import { checkTokenValidity } from "../redux/slices/authSlice.js";

function Login() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatch(checkTokenValidity());
    }
  }, [dispatch, user]);

  return (
    <>
      <h1>Olá{user ? `, ${user.name}` : ""}</h1>
      {!user && <LoginComponent />}
    </>
  );
}

export default Login;
