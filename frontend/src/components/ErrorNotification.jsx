import { useEffect } from "react";
import { notification } from "antd";

const ErrorNotification = ({ error }) => {
  useEffect(() => {
    if (!error) return;
    const errorMessage =
      error.code === 429
        ? "Muitas requisições. Tente novamente mais tarde."
        : error.message || "Ocorreu um erro desconhecido.";

    notification.error({
      type: "error",
      message: `Erro ${error.code || ""}`,
      description: errorMessage,
    });
    ("");
  }, [error]);

  return null;
};

export default ErrorNotification;
