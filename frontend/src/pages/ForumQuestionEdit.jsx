import {
  useGetForumQuestionQuery,
  useUpdateForumQuestionMutation,
} from "../api/slices/forumApiSlice";
import { useGetTagsQuery } from "../api/slices/tagsApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import LayoutComponent from "./layout/LayoutComponent";
import { Form, Input, Button, Select, Spin, notification } from "antd";
import { useState, useEffect } from "react";
import { MoveLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";

const ForumQuestionEdit = () => {
  const [form] = Form.useForm();
  const { questionId } = useParams();
  const { isLoading: tagsLoading, data: tags } = useGetTagsQuery();
  const [tagId, setTagId] = useState(0);
  const userState = useSelector(selectCurrentUser);
  const [updateForumQuestion] = useUpdateForumQuestionMutation();

  const navigate = useNavigate();

  const questionData = useGetForumQuestionQuery(questionId);

  useEffect(() => {
    if (questionData.data && questionData.data.Answer.length > 0) {
      notification.error({
        message: "Erro ao editar pergunta",
        description:
          "Não é possível editar uma pergunta que já possui respostas",
      });
      return navigate(`/forum/${questionId}`);
    }
    if (questionData.data && questionData.data.userId !== userState.id) {
      notification.error({
        message: "Erro ao editar pergunta",
        description: "Você não pode editar uma pergunta que não é sua.",
      });
      return navigate("/forum");
    }
  }, [questionData.data, navigate, userState.id, questionId]);

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

  const onFinish = async (values) => {
    try {
      let defaultTagId = tagId;

      if (tagId == 0) {
        defaultTagId = questionData.data.tag.id;
      }

      values.tagId = defaultTagId;

      await updateForumQuestion({ id: questionId, question: values });

      notification.success({
        message: "Pergunta editada com sucesso",
      });
      navigate(`/forum/${questionId}`);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Erro ao editar a pergunta",
        description: error.error,
      });
    }
  };

  let content;

  if (questionData.isLoading) {
    content = <Spin fullscreen />;
  } else if (questionData.error) {
    content = <p>Erro: {questionData.error}</p>;
  } else if (questionData.data) {
    content = (
      <LayoutComponent>
        <div className="flex items-end justify-between mb-3 text-text">
          <p className="text-4xl font-bold ">Modifique sua pergunta</p>
        </div>

        <Form
          form={form}
          name="perguntar"
          initialValues={{ ...questionData.data }}
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
                defaultValue={questionData.data.tag.name}
                onChange={(_, { key }) => setTagId(key)}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="w-full mt-2" htmlType="submit">
              Salvar pergunta
            </Button>
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
  }

  return content;
};

export default ForumQuestionEdit;
