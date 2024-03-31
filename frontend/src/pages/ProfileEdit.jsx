import {
  Form,
  Input,
  Button,
  notification,
  Spin,
  Upload,
  Row,
  Col,
} from "antd";
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
  const [originalAvatar, setOriginalAvatar] = useState(user.avatar);

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
        notification.error({
          message: `O arquivo não foi enviado!`,
          description: `${file.name} deve ser do tipo PNG ou JPG!`,
        });
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        isAccept = false;
        notification.error({
          message: `O arquivo não foi enviado!`,
          description: `O avatar precisa ter menos de 5MB!`,
        });
      }
      return isAccept || Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info.file.status === "done") {
        if (serverFile) {
          deleteAvatar(serverFile);
        }
        setServerFile(info.file.response.avatarPath);
        notification.success({
          message: `Arquivo enviado!`,
          description: `${info.file.name} foi enviado ao servidor!`,
        });
      }
    },
    onRemove(serverFile) {
      deleteAvatar(serverFile.response.avatarPath)
        .then(() => {
          setServerFile(null);
          notification.success({
            message: `Arquivo removido!`,
            description: `Você removeu o arquivo com sucesso!`,
          });
        })
        .catch((error) => {
          console.error("Error removing file", error);
          notification.error({
            message: "Erro ao remover o arquivo",
            description:
              "Ocorreu um erro ao tentar remover o arquivo. Por favor, tente novamente.",
          });
        });
    },
  };

  useEffect(() => {
    setOriginalAvatar(user.avatar);
  }, [user.avatar]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onFinish = (data) => {
    // eslint-disable-next-line no-unused-vars
    const { "new-password": password, "confirm-password": _, ...rest } = data;
    console.log("data:", data);
    console.log("pass:", password);
    console.log("serverFile on onFinish:", serverFile);

    if (serverFile) {
      rest.avatar = serverFile;
      deleteAvatar(originalAvatar);
    } else {
      rest.avatar = originalAvatar;
    }
    updateUser({ id: user.id, password, ...rest })
      .unwrap()
      .then((payload) => {
        console.log("payload:", payload);
        dispatch(updateUserState(payload));
        notification.success({
          message: `Dados atualizados!`,
          description: `Você atualizou com sucesso seus dados de usuário!`,
        });
      })
      .catch((error) => {
        return notification.error({
          message: `Erro ${error.data.code || ""}`,
          description: error.data.message,
        });
      });
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
        <div className="min-h-[calc(100vh-200px)]">
          <Form
            name="register"
            initialValues={{ ...userData }}
            layout="vertical"
            className="text-left mb-[5px]"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="Usuário:"
              hasFeedback="true"
              rules={[
                {
                  required: true,
                  message: "Este campo não pode ser vazio!",
                },
              ]}
            >
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
                {
                  required: true,
                  message: "Este campo não pode ser vazio!",
                },
              ]}
            >
              <Input placeholder="Digite seu email" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="new-password"
                  hasFeedback="true"
                  label="Nova senha:"
                  rules={[
                    {
                      min: 8,
                      message: "A senha deve ter no mínimo 8 caracteres!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Digite a nova senha" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirm-password"
                  hasFeedback="true"
                  dependencies={["new-password"]}
                  label="Confirmar nova senha:"
                  rules={[
                    {
                      min: 8,
                      message: "A senha deve ter no mínimo 8 caracteres!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value && getFieldValue("new-password")) {
                          return Promise.reject(new Error());
                        }
                        if (value !== getFieldValue("new-password")) {
                          return Promise.reject(
                            new Error("As senhas não correspondem!")
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                    ({ getFieldValue }) => ({
                      required: !!getFieldValue("new-password"),
                      message: "Por favor, confirme sua senha!",
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirme sua senha" />
                </Form.Item>
              </Col>
            </Row>
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
                    notification.success({
                      message: `Avatar atualizado!`,
                      description: `Você removeu com sucesso o seu avatar!`,
                    });
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
