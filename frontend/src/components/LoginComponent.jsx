import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { Form, Input, Button } from "antd";
import ErrorNotification from "./ErrorNotification.jsx";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);

  const onFinish = (values) => {
    dispatch(loginUser(values));
  };

  return (
    <>
      <ErrorNotification error={authError} />

      <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={authStatus === "loading"}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginComponent;
