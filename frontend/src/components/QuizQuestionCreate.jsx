import { Button, Dropdown, Form, Input, notification, Tooltip } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestion,
  getEditing,
  getQuestion,
  removeQuestion,
  setStep,
  updateQuestion,
} from "../redux/slices/quizCreateSlice.js";
import { useHandleCancel } from "../utils/quiz/handleCancel.js";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const QuizQuestionCreate = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const question = useSelector(getQuestion);
  const editing = useSelector(getEditing);
  const handleCancel = useHandleCancel();
  const [questionId, setQuestionId] = useState(null);
  const [editQuestion, setEditQuestion] = useState(false);

  const onFinish = async (values) => {
    setEditQuestion(false);
    try {
      const existingQuestionIndex = question.findIndex(
        (q) => q.id === questionId,
      );

      if (existingQuestionIndex !== -1) {
        dispatch(
          updateQuestion({
            index: existingQuestionIndex,
            question: { ...values, id: questionId },
          }),
        );
      } else {
        dispatch(addQuestion(values));
      }

      notification.success({
        message: "Questão salva com sucesso!",
        description:
          "Agora você pode revisar o questionário ou criar mais uma questão.",
      });
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Erro ao criar questão!",
        description: error.data.message,
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4 text-text">
        <div className="col-span-4 bg-white p-[10px] flex flex-col gap-[10px] rounded-[10px]">
          <p className="text-2xl font-extrabold">Questões</p>

          {question.map((item, index) => {
            const handleRemove = () => {
              dispatch(removeQuestion(index));
            };

            const settings = [
              {
                key: "edit",
                label: "Editar",
                onClick: () => {
                  setEditQuestion(true);
                  form.setFieldsValue(item);
                  console.log("item", item);
                  if (!editing) {
                    handleRemove();
                  } else {
                    setQuestionId(item.id);
                  }
                },
              },
              {
                key: "delete",
                label: "Deletar",
                danger: true,
                onClick: () => {
                  const updatedQuestion = {
                    ...question[index],
                    deleted: true,
                  };
                  dispatch(
                    updateQuestion({ index, question: updatedQuestion }),
                  );
                },
              },
            ];

            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 border-2 border-solid border-neutral-200 rounded-[10px]"
                style={item.deleted ? { display: "none" } : {}}
              >
                <p className="truncate hover:whitespace-normal">
                  {item.description}
                </p>
                <Dropdown
                  menu={{
                    items: settings,
                  }}
                  trigger={["click"]}
                  className="cursor-pointer"
                >
                  <EllipsisOutlined className="p-2 text-xl rounded-md text-text hover:bg-background " />
                </Dropdown>
              </div>
            );
          })}
        </div>

        <div className="col-span-8">
          <Form
            form={form}
            name="myForm"
            layout="vertical"
            className="text-left   rounded-[10px]"
            onFinish={onFinish}
          >
            <Form.Item
              name="description"
              label="Pergunta:"
              hasFeedback="true"
              rules={[
                { required: true, message: "Este é um campo obrigatório!" },
                { min: 50, message: "É preciso ter ao menos 50 caracteres" },
              ]}
            >
              <Input.TextArea
                placeholder="Digite uma pergunta"
                showCount
                className="bg-white"
              />
            </Form.Item>
            <Form.Item
              name="correct"
              label="Resposta correta:"
              hasFeedback="true"
              rules={[
                { required: true, message: "Este é um campo obrigatório!" },
              ]}
            >
              <Input
                placeholder="Digite a resposta correta"
                className="bg-white"
              />
            </Form.Item>
            <Form.Item
              name="wrong1"
              label="Resposta incorreta (1/4):"
              hasFeedback="true"
              rules={[
                { required: true, message: "Este é um campo obrigatório!" },
              ]}
            >
              <Input
                placeholder="Digite a primeira resposta incorreta"
                className="bg-white"
              />
            </Form.Item>
            <Form.Item
              name="wrong2"
              label="Resposta incorreta (2/4):"
              hasFeedback="true"
              rules={[
                { required: true, message: "Este é um campo obrigatório!" },
              ]}
            >
              <Input
                placeholder="Digite a segunda resposta incorreta"
                className="bg-white"
              />
            </Form.Item>
            <Form.Item
              name="wrong3"
              label="Resposta incorreta (3/4):"
              hasFeedback="true"
              rules={[
                { required: true, message: "Este é um campo obrigatório!" },
              ]}
            >
              <Input
                placeholder="Digite a terceira resposta incorreta"
                className="bg-white"
              />
            </Form.Item>
            <Form.Item
              name="wrong4"
              label="Resposta incorreta (4/4):"
              hasFeedback="true"
              rules={[
                { required: true, message: "Este é um campo obrigatório!" },
              ]}
            >
              <Input
                placeholder="Digite a quarta resposta incorreta"
                className="bg-white"
              />
            </Form.Item>

            <p className="opacity-80 text-sm">
              Tenha em mente que a ordem de exibição das respostas é alterada
              aleatóriamente em cada questão.
            </p>

            <Form.Item>
              <Button type="primary" className="w-full mt-4" htmlType="submit">
                {editQuestion ? "Atualizar" : "Adicionar"} questão
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="col-span-full">
          <Tooltip
            title={
              question.filter((item) => !item.deleted).length === 0
                ? "Você precisa adicionar ao menos uma questão para continuar!"
                : ""
            }
            placement="topLeft"
          >
            <Button
              type="primary"
              style={
                question.filter((item) => !item.deleted).length !== 0 && {
                  background: "rgb(255, 64, 129, 1)",
                }
              }
              disabled={question.filter((item) => !item.deleted).length === 0}
              className="w-full"
              onClick={() => {
                if (question.filter((item) => !item.deleted).length === 0)
                  return;
                dispatch(setStep(2));
              }}
            >
              Revisar questionário
            </Button>
          </Tooltip>
          <Button
            className="w-full mt-2 pr-2 flex items-center justify-center"
            onClick={() => {
              dispatch(setStep(0));
            }}
          >
            <ArrowLeft size="16" />
            Voltar
          </Button>
          <Button danger onClick={handleCancel} className="w-full mt-2 pr-2">
            Cancelar
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuizQuestionCreate;
