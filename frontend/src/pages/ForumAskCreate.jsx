import LayoutComponent from "./layout/LayoutComponent";
import {
  Form,
  Input,
  Button,
  notification,
  Spin,
  Popconfirm,
  Select,
} from "antd";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetUsersQuery } from "../api/slices/profileApiSlice";
import { MoveLeft } from "lucide-react";
import { useCreateForumQuestionMutation } from "../api/slices/forumApiSlice";
import { useCreateTagRelationMutation } from "../api/slices/tagsRelationApiSlice";
import { useGetTagsQuery } from "../api/slices/tagsApiSlice";

export const ForumAskCreate = () => {
  const [form] = Form.useForm();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tagId, setTagId] = useState(0);
  const [createForumQuestion, { isLoading }] = useCreateForumQuestionMutation();
  const [createTagRelation] = useCreateTagRelationMutation();
  const { isLoading: tagsLoading, data: tags } = useGetTagsQuery();

  const userState = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  let tagOptions = [];

  if (!tagsLoading) {
    tagOptions = Object.values(tags).map((tag) => {
      return {
        label: tag.name,
        key: tag.id,
        value: tag.name,
      };
    });
  }

  const {
    data: userData,
    error,
    isLoading: isFetching,
    refetch,
  } = useGetUsersQuery(userState.id);

  useEffect(() => {
    refetch();
  }, [userState, refetch]);

  // useEffect(() => {
  //   if (question && tagId !== 0) {
  //     try {
  //       createTagRelation({ questionId: question.id, tagId });
  //     } catch (error) {
  //       notification.error({
  //         message: "Erro ao criar relação",
  //         description: error.error,
  //       });
  //     }
  //   }
  // }, [question, tagId]);

  useEffect(() => {
    if (userState.points < 1) {
      notification.error({
        message: "Você não pode acessar este recurso!",
        description:
          "Você precisa de pelo menos 1 ponto para criar uma pergunta.",
      });

      navigate("/forum");
    }
  }, [userState, navigate]);

  const onFinish = async (values) => {
    try {
      const { data: question } = await createForumQuestion(values);

      let defaultTagId = tagId;

      if (tagId == 0) {
        defaultTagId = tagOptions[0].key;
      }

      try {
        await createTagRelation({
          questionId: question.id,
          tagId: defaultTagId,
        });
      } catch (error) {
        notification.error({
          message: "Erro ao criar relação",
          description: error.error,
        });
      }

      notification.success({
        message: "Pergunta criada com sucesso",
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
    content = (
      <LayoutComponent>
        <p>Erro: {error}</p>
      </LayoutComponent>
    );
  } else if (userData) {
    content = userData.points;
  }
  return (
    <LayoutComponent>
      <div className="flex items-end justify-between mb-3 text-text">
        <p className="text-4xl font-bold ">Faça sua pergunta</p>
        <p>Pontos disponíveis: {content}</p>
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
          <Input placeholder="Digite o título" />
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
          <Input.TextArea placeholder="Digite uma descrição detalhada para a sua pergunta" />
        </Form.Item>

        <Form.Item label="Categoria" required>
          {!tagsLoading && (
            <Select
              style={{ width: "100%" }}
              placeholder="Tags"
              showSearch
              options={tagOptions}
              defaultValue={tagOptions[0].value}
              onChange={(_, { key }) => setTagId(key)}
            />
          )}
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
