import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input } from "antd";
import { useLoginUserMutation } from "../api/slices/authApiSlice.js";
import { clearAuthError, setUser } from "../redux/slices/authSlice";
import ErrorNotification from "./ErrorNotification.jsx";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();

  const onFinish = async (values) => {
    try {
      const response = await loginUser(values).unwrap();
      const { user, tokens } = response;
      dispatch(
        setUser({
          user,
          accessToken: tokens.access.token,
          refreshToken: tokens.refresh.token,
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
        className="text-left mb-[5px]"
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
            className="w-full mt-2 mb-[20px]"
            loading={isLoading || authStatus === "loading"}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginComponent;
