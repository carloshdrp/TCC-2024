import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, registerUser } from "../redux/slices/authSlice";
import { Form, Input, Button } from "antd";
import ErrorNotification from "./ErrorNotification.jsx";

const RegisterComponent = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);

  const onFinish = (values) => {
    dispatch(registerUser(values));
  };

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <>
      <ErrorNotification error={authError} />

      <Form
        name="register"
        initialValues={{ remember: true }}
        layout="vertical"
        className="text-left mb-[5px]"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Usuário:"
          hasFeedback="true"
          rules={[{ required: true, message: "Este é um campo obrigatório!" }]}
        >
          <Input placeholder="Digite seu nome de usuário" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email:"
          hasFeedback="true"
          rules={[
            { required: true, message: "Este é um campo obrigatório!" },
            { type: "email", message: "Por favor, insira um email válido!" },
          ]}
        >
          <Input placeholder="Digite seu email" />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback="true"
          label="Senha:"
          rules={[{ required: true, message: "Este é um campo obrigatório!" }]}
        >
          <Input.Password placeholder="Digite sua senha" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-2 mb-[20px]"
            loading={authStatus === "loading"}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterComponent;
