import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginComponent from "../components/LoginComponent.jsx";
import { checkTokenValidity } from "../redux/slices/authSlice.js";
import LayoutComponent from "./layout/LayoutComponent.jsx";
import { Link } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatch(checkTokenValidity());
    }
  }, [dispatch, user]);

  return (
    <LayoutComponent>
      <div
        className={`min-h-[calc(100vh-200px)] py-[30px] flex flex-col items-center justify-center text-white background-opacity`}
      >
        <div className="z-10 text-center bg-white text-text flex flex-col items-center gap-[20px] rounded-[25px] w-[510px] border-solid border-[#D9D9D9] border-2">
          <h2 className="m-0 mt-[25px] text-6xl">
            🚀{user ? `, ${user.name}` : ""}
          </h2>
          <p className="m-0 text-3xl font-semibold">Bem vindo de volta</p>
          <p className="m-0 ">É um prazer vê-lo novamente 👋</p>
          {!user && <LoginComponent />}
        </div>
        <Link to="/register" className="z-10 mt-2">
          Ainda não tem uma conta? Registre-se!
        </Link>
      </div>
    </LayoutComponent>
  );
}

export default Login;
