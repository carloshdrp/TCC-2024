import LayoutComponent from "./layout/LayoutComponent";
import {
  Button,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Spin,
} from "antd";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetUsersQuery } from "../api/slices/profileApiSlice";
import { MoveLeft } from "lucide-react";
import { useCreateForumQuestionMutation } from "../api/slices/forumApiSlice";
import coin from "../assets/coin.png";
import tags from "../utils/tags.json";

export const ForumAskCreate = () => {
  const [form] = Form.useForm();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState(tags[0].name);
  const [createForumQuestion, { isLoading }] = useCreateForumQuestionMutation();

  const userState = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  let tagOptions = [];

  tagOptions = tags.map((tag) => {
    return {
      label: tag.name,
      key: tag.id,
      value: tag.name,
    };
  });

  const {
    data: userData,
    error,
    isLoading: isFetching,
    refetch,
  } = useGetUsersQuery(userState.id);

  useEffect(() => {
    refetch();
  }, [userState, refetch]);

  useEffect(() => {
    if (userData?.points < 1) {
      notification.error({
        message: "Você não pode acessar este recurso!",
        description:
          "Você precisa de pelo menos 1 ponto para criar uma pergunta.",
      });

      navigate("/forum");
    }
  }, [userData]);

  const onFinish = async (values) => {
    try {
      values.tag = selectedTag;

      console.log(values);

      await createForumQuestion(values);

      notification.success({
        message: "Pergunta criada com sucesso",
        description: "Foi descontado 1 ponto de sua conta.",
      });
      navigate("/forum");
    } catch (error) {
      notification.error({
        message: "Erro ao criar pergunta",
        description: error.error,
      });
    }
  };

  const handleConfirm = () => {
    setConfirmVisible(false);
    form.submit();
  };

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  let content;
  if (isFetching) {
    content = <Spin />;
  } else if (error) {
    content = <p>Erro</p>;
  } else if (userData) {
    content = userData.points;
  }
  return (
    <LayoutComponent>
      <div className="flex items-end justify-between mb-3 text-text">
        <p className="text-4xl font-bold ">Faça sua pergunta</p>
        <p className="flex items-center">
          Pontos disponíveis: <b>{content}</b>
          <img src={coin} alt="coin" className="w-4 h-4" />
        </p>
      </div>

      <Form
        form={form}
        name="perguntar"
        initialValues={{ remember: true }}
        layout="vertical"
        className="text-left px-3 py-2 bg-white rounded-[10px]"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="Título:"
          hasFeedback="true"
          rules={[
            { required: true, message: "Este é um campo obrigatório!" },
            {
              min: 10,
              message: "O título deve ter no mínimo 10 caracteres!",
            },
          ]}
        >
          <Input placeholder="Digite o título" showCount />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descrição:"
          hasFeedback="true"
          rules={[
            { required: true, message: "Este é um campo obrigatório!" },
            {
              min: 50,
              message: "A descrição deve ter no mínimo 50 caracteres!",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Digite uma descrição detalhada para a sua pergunta"
            showCount
          />
        </Form.Item>

        <Form.Item label="Categoria" required>
          <Select
            style={{ width: "100%" }}
            placeholder="Tags"
            showSearch
            options={tagOptions}
            defaultValue={tagOptions[0].value}
            onChange={(value) => setSelectedTag(value)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="w-full mt-2"
            loading={isLoading}
            onClick={() => {
              form.validateFields().then(() => setConfirmVisible(true));
            }}
          >
            Adicionar pergunta
          </Button>
          <Popconfirm
            title="Essa ação custa 1 ponto"
            description="Você tem certeza que deseja continuar?"
            open={confirmVisible}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            placement="topRight"
            okText="Sim"
            cancelText="Voltar"
          />
        </Form.Item>
      </Form>
      <Button
        className="flex items-center justify-center w-full gap-2 mt-2 text-text"
        onClick={() => navigate("/forum")}
      >
        <MoveLeft strokeWidth={1.5} /> Voltar
      </Button>
    </LayoutComponent>
  );
};
