import { Form, Input, Button, message, Spin, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { updateUserState, selectCurrentUser } from "../redux/slices/authSlice";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../api/profileApiSlice";
import LayoutComponent from "./layout/LayoutComponent.jsx";
import ScrollTop from "../components/ScrollTop.jsx";
import { useEffect, useState } from "react";
import { clearAuthError, selectCurrentToken } from "../redux/slices/authSlice";
import { UploadOutlined } from "@ant-design/icons";
import ErrorNotification from "../components/ErrorNotification.jsx";
import { useDeleteAvatarMutation } from "../api/slices/avatarApiSlice";
import ImgCrop from "antd-img-crop";
import { useNavigate } from "react-router-dom";

function ProfileEdit() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [deleteAvatar] = useDeleteAvatarMutation();
  const [serverFile, setServerFile] = useState(null);

  const { data: userData, error, isLoading } = useGetUsersQuery(user.id);
  const [updateUser] = useUpdateUserMutation();

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
        if (userData.avatar) {
          deleteAvatar(userData.avatar);
        }
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
  const authError = useSelector((state) => state.auth.error);

  const navigate = useNavigate();

  const onFinish = (data) => {
    data.avatar = serverFile;
    updateUser({ id: user.id, ...data })
      .unwrap()
      .then((payload) => {
        console.log("payload:", payload);
        dispatch(updateUserState(payload));
      })
      .catch((error) => {
        console.log("error:", error);
      });
    message.success("Dados atualizados com sucesso!");
    navigate("/profile");
  };

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  let content;
  if (isLoading) {
    content = <Spin fullscreen />;
  } else if (error) {
    content = <p>Erro: {error}</p>;
  } else if (userData) {
    content = (
      <>
        <ErrorNotification error={authError} />
        <div className="min-h-[calc(100vh-200px)]">
          <Form
            name="register"
            initialValues={{ ...userData }}
            layout="vertical"
            className="text-left mb-[5px]"
            onFinish={onFinish}
          >
            <Form.Item name="name" label="Usuário:" hasFeedback="true">
              <Input placeholder="Digite seu nome de usuário" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email:"
              hasFeedback="true"
              rules={[
                {
                  type: "email",
                  message: "Por favor, insira um email válido!",
                },
              ]}
            >
              <Input placeholder="Digite seu email" />
            </Form.Item>
            <Form.Item
              name="new-password"
              hasFeedback="true"
              label="Senha:"
              rules={[
                {
                  min: 8,
                  message: "A senha deve ter no mínimo 8 caracteres!",
                },
              ]}
            >
              <Input.Password placeholder="Digite a nova senha" />
            </Form.Item>
            <Form.Item
              name="confirm-password"
              hasFeedback="true"
              label="Confirmar senha:"
              rules={[
                {
                  min: 8,
                  message: "A senha deve ter no mínimo 8 caracteres!",
                },
              ]}
            >
              <Input.Password placeholder="Confirme sua senha" />
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
                    <Button icon={<UploadOutlined />}>
                      Selecionar um arquivo
                    </Button>
                  )}
                </Upload>
              </ImgCrop>
              <Button
                onClick={() => {
                  if (user.avatar) {
                    deleteAvatar(user.avatar);
                    message.success("Avatar removido com sucesso!");
                  }
                  setServerFile(null);
                }}
                className="mt-2"
                {...(user.avatar ? { disabled: false } : { disabled: true })}
              >
                Remover avatar atual
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full mt-2 mb-[20px]"
                loading={isLoading === "loading"}
              >
                Salvar alterações
              </Button>
              <Button
                type="default"
                className="w-full"
                onClick={() => navigate("/profile")}
              >
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    );
  }

  return (
    <LayoutComponent>
      <ScrollTop />
      {content}
    </LayoutComponent>
  );
}

export default ProfileEdit;
