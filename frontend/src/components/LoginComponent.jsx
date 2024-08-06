import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, Form, Input } from "antd";
import { useLoginUserMutation } from "../api/slices/authApiSlice.js";
import { clearAuthError, setUser } from "../redux/slices/authSlice";
import ErrorNotification from "./ErrorNotification.jsx";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();

  const [stayConnected, setStayConnected] = useState(false);

  const onFinish = async (values) => {
    try {
      const loginData = {
        email: values.email,
        password: values.password,
      };
      const response = await loginUser({ loginData }).unwrap();
      const { user, tokens } = response;
      dispatch(
        setUser({
          user,
          accessToken: tokens.access.token,
          refreshToken: tokens.refresh.token,
          stayConnected,
        }),
      );
    } catch (err) {
      console.error("Login error", err);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const [form] = Form.useForm();

  return (
    <>
      <ErrorNotification error={authError || (isError && error.message)} />

      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        layout="vertical"
        className="text-left mb-[5px] w-full px-8"
        onFinish={onFinish}
      >
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
          label="Senha:"
          hasFeedback="true"
          rules={[{ required: true, message: "Este é um campo obrigatório!" }]}
        >
          <Input.Password placeholder="Digite sua senha" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-2"
            loading={isLoading || authStatus === "loading"}
          >
            Entrar
          </Button>
        </Form.Item>
        <Form.Item>
          <Checkbox
            className="mb-[20px]"
            checked={stayConnected}
            onChange={(e) => setStayConnected(e.target.checked)}
          >
            Permanecer conectado
          </Checkbox>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginComponent;
