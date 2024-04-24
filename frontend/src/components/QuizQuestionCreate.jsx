import { Button, Dropdown, Form, Input, notification } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestion,
  getQuestion,
  setStep,
  removeQuestion,
} from "../redux/slices/quizCreateSlice.js";

const QuizQuestionCreate = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const question = useSelector(getQuestion);
  // dispatch(setStep(2));

  const onFinish = async (values) => {
    try {
      dispatch(addQuestion(values));

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
          <div className="flex justify-between">
            <p className="text-2xl font-extrabold">Questões</p>
            <Button
              type="primary"
              style={
                question.length !== 0 && { background: "rgb(255, 64, 129, 1)" }
              }
              disabled={question.length === 0}
              onClick={() => {
                if (question.length === 0) return;
                dispatch(setStep(2));
              }}
            >
              Revisar
            </Button>
          </div>

          {question.map((item, index) => {
            const handleRemove = () => {
              dispatch(removeQuestion(index));
            };

            const settings = [
              {
                key: "edit",
                label: "Editar",
                onClick: () => {
                  form.setFieldsValue(item);
                  handleRemove();
                },
              },
              {
                key: "delete",
                label: "Deletar",
                danger: true,
                onClick: handleRemove,
              },
            ];

            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 border-2 border-solid border-neutral-200 rounded-[10px]"
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
            className="text-left px-3 py-2  rounded-[10px]"
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

            <Form.Item>
              <Button type="primary" className="w-full mt-4" htmlType="submit">
                Adicionar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default QuizQuestionCreate;
