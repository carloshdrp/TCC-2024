import LayoutComponent from "./layout/LayoutComponent.jsx";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
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
            <Button onClick={() => navigate(-1)} type="primary" size="large">
              Voltar à página anterior
            </Button>
          }
        />{" "}
      </div>
    </LayoutComponent>
  );
}

export default NotFound;
