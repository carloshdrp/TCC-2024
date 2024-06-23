import { useEffect } from "react";
import { notification } from "antd";
import PropTypes from "prop-types";

const ErrorNotification = ({ error }) => {
  useEffect(() => {
    if (error) {
      let errorMessage = "Ocorreu um erro desconhecido.";
      if (error.code === 429) {
        errorMessage = "Muitas requisições. Tente novamente mais tarde.";
      } else if (error.status === 401) {
        if (error.data.message === "Email ou senha incorretos") {
          errorMessage = "Email ou senha incorretos.";
        } else if (error.data.message !== "Email ou senha incorretos") {
          errorMessage =
            "A sua sessão de usuário expirou. Faça login novamente.";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      notification.error({
        type: "error",
        message: `Erro ${error.code || error.status || ""}`,
        description: errorMessage,
      });
    }
  }, [error]);

  return null;
};

ErrorNotification.propTypes = {
  error: PropTypes.shape({
    code: PropTypes.number,
    status: PropTypes.number,
    message: PropTypes.string,
    data: PropTypes.shape({
      message: PropTypes.string,
    }),
  }),
};

export default ErrorNotification;
