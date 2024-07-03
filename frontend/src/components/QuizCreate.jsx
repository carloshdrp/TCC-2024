import { Button, Form, Input, notification, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getQuiz, setQuiz, setStep } from "../redux/slices/quizCreateSlice.js";
import { useHandleCancel } from "../utils/quiz/handleCancel.js";
import { getMenuTab } from "../redux/slices/quizMenuSlice.js";

const QuizCreate = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const menuTab = useSelector(getMenuTab);

  const quizData = useSelector(getQuiz);

  const onFinish = async (values) => {
    try {
      const updatedQuiz = { ...quizData, ...values };
      dispatch(setQuiz(updatedQuiz));
      dispatch(setStep(1));

      notification.success({
        message: "Questionário salvo com sucesso!",
        description: "Agora você precisa criar as perguntas.",
      });
    } catch (error) {
      notification.error({
        message: "Erro ao criar questionário!",
        description: error.data.message,
      });
    }
  };

  const subjects = [
    {
      value: "MATEMATICA",
      label: "Matemática",
    },
    {
      value: "PORTUGUES",
      label: "Português",
    },
    {
      value: "HISTORIA",
      label: "História",
    },
    {
      value: "GEOGRAFIA",
      label: "Geografia",
    },
    {
      value: "BIOLOGIA",
      label: "Biologia",
    },
    {
      value: "QUIMICA",
      label: "Química",
    },
    {
      value: "FISICA",
      label: "Física",
    },
    {
      value: "SOCIOLOGIA",
      label: "Sociologia",
    },
    {
      value: "FILOSOFIA",
      label: "Filosofia",
    },
    {
      value: "INGLES",
      label: "Inglês",
    },
    {
      value: "ESPANHOL",
      label: "Espanhol",
    },
    {
      value: "ARTE",
      label: "Arte",
    },
    {
      value: "EDUCACAO_FISICA",
      label: "Educação Física",
    },
  ];

  if (quizData) {
    form.setFieldsValue(quizData);
  }

  const handleCancel = useHandleCancel();
  return (
    <>
      <Form
        form={form}
        name="myForm"
        layout="vertical"
        className="text-left px-3 py-2 bg-white rounded-[10px]"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="Título:"
          hasFeedback="true"
          rules={[{ required: true, message: "Este é um campo obrigatório!" }]}
        >
          <Input placeholder="Digite um título" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descrição:"
          hasFeedback="true"
          rules={[{ required: true, message: "Este é um campo obrigatório!" }]}
        >
          <Input.TextArea placeholder="Descreva o seu questionário" />
        </Form.Item>
        <Form.Item
          name="subject"
          label="Matéria:"
          hasFeedback="true"
          rules={[{ required: true, message: "Este é um campo obrigatório!" }]}
        >
          <Select
            showSearch
            placeholder="Selecione a matéria do questionário"
            options={subjects}
            defaultValue={
              menuTab !== "Descobrir" &&
              menuTab !== "Seus questionários" &&
              menuTab !== "Seu histórico"
                ? menuTab
                : null
            }
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" className="w-full mt-2" htmlType="submit">
            Avançar
          </Button>
          <Button danger onClick={handleCancel} className="w-full mt-2">
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default QuizCreate;
