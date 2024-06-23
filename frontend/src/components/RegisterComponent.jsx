import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  selectCurrentAccessToken,
  setUser,
} from "../redux/slices/authSlice";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Upload } from "antd";
import ErrorNotification from "./ErrorNotification.jsx";
import { useDeleteAvatarMutation } from "../api/slices/avatarApiSlice";
import { useNavigate } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { useRegisterUserMutation } from "../api/slices/authApiSlice.js";

const RegisterComponent = () => {
  const token = useSelector(selectCurrentAccessToken);
  const [deleteAvatar] = useDeleteAvatarMutation();
  const [serverFile, setServerFile] = useState(null);
  const [registerUser, { isLoading, isError, error }] =
    useRegisterUserMutation();

  const props = {
    name: "avatar",
    action: "http://localhost:8080/auth/avatar",
    maxCount: 1,
    listType: "picture",
    headers: {
      authorization: "Bearer " + token,
    },
    beforeUpload: (file) => {
      let isAccept = file.type === "image/png" || file.type === "image/jpeg";
      if (!isAccept) {
        message.error(`${file.name} deve ser PNG ou JPG!`);
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        isAccept = false;
        message.error("O avatar precisa ter menos de 5MB!");
      }
      return isAccept || Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info.file.status === "done") {
        if (serverFile) {
          deleteAvatar(serverFile);
        }

        setServerFile(info.file.response.avatarPath);
        message.success(`${info.file.name} Arquivo enviado com sucesso!`);
      }
    },
    onRemove(serverFile) {
      deleteAvatar(serverFile)
        .then(() => {
          message.success(`Arquivo removido com sucesso!`);
          setServerFile(null);
        })
        .catch((error) => {
          console.error("Error removing file", error);
        });
    },
  };

  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      values.avatar = serverFile;
      const response = await registerUser(values).unwrap();
      const { user, tokens } = response;
      dispatch(
        setUser({
          user,
          accessToken: tokens.access.token,
          refreshToken: tokens.refresh.token,
        }),
      );
      message.success("Registro realizado com sucesso!");
      navigate("/login");
    } catch (err) {
      message.error(
        "Ocorreu um erro ao registrar. Por favor, tente novamente.",
      );
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <>
      <ErrorNotification error={authError || (isError && error.message)} />

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
          rules={[
            { required: true, message: "Este é um campo obrigatório!" },
            {
              min: 8,
              message: "A senha deve ter no mínimo 8 caracteres!",
            },
          ]}
        >
          <Input.Password placeholder="Digite sua senha" />
        </Form.Item>
        <Form.Item
          name="avatar"
          hasFeedback="true"
          label="Avatar:"
          tooltip="São aceitos arquivos JPG e PNG"
        >
          <ImgCrop rotationSlider>
            <Upload {...props}>
              {!serverFile && (
                <Button icon={<UploadOutlined />}>Selecione um arquivo</Button>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-2 mb-[20px]"
            loading={isLoading || authStatus === "loading"}
          >
            Registrar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterComponent;
