import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "../redux/slices/authSlice";
import { Form, Input, Button } from "antd";
import ErrorNotification from "./ErrorNotification.jsx";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);

  const onFinish = (values) => {
    dispatch(loginUser(values));
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
        name="login"
        initialValues={{ remember: true }}
        layout="vertical"
        className="text-left mb-[5px]"
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="Email:"
          rules={[{ required: true, message: "Este é um campo obrigatório!" }]}
        >
          <Input placeholder="Digite seu email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Senha:"
          rules={[{ required: true, message: "Este é um campo obrigatório!" }]}
        >
          <Input.Password placeholder="Digite sua senha" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-2"
            loading={authStatus === "loading"}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginComponent;
