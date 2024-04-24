import { Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { setStep } from "../redux/slices/exerciseCreateSlice.js";

const QuizCreate = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const onFinish = async (values) => {
    console.log(values);
    dispatch(setStep(1));
  };

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
        <Form.Item>
          <Button type="primary" className="w-full mt-2" htmlType="submit">
            Avançar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default QuizCreate;
