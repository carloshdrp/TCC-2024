import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkTokenValidity } from "../redux/slices/authSlice.js";
import LayoutComponent from "./layout/LayoutComponent.jsx";
import { Result } from "antd";
import { Link } from "react-router-dom";

function NotFound() {
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
        className={`min-h-[calc(100vh-200px)] flex flex-col items-center justify-center`}
      >
        <Result
          status="404"
          title="404"
          subTitle="Desculpe, a página que você visitou não existe."
          extra={
            <Link to="/" className="btn-full">
              Voltar ao início
            </Link>
          }
        />{" "}
      </div>
    </LayoutComponent>
  );
}

export default NotFound;
