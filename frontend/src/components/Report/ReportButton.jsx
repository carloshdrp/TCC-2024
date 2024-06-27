import { useState } from "react";
import { Button, Form, Modal, notification, Select } from "antd";
import { AlertOctagon } from "lucide-react";
import { useCreateReportMutation } from "../../api/slices/reportApiSlice.js";

const { Option } = Select;

const ReportButton = ({ type, userId, resourceId, resourceOnwerId }) => {
  const [open, setOpen] = useState(false);
  const [createReport, { isLoading }] = useCreateReportMutation();
  const [form] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      await createReport({
        ...values,
        reportableId: resourceId,
        reportableType: type,
      }).unwrap();
      notification.success({
        message: "Denúncia criada com sucesso!",
        description: "Ela será analisada por nossa equipe.",
      });
      handleCancel();
    } catch (error) {
      notification.error({
        message: "Erro ao criar denúncia!",
        description: error.data.message,
      });
    }
  };

  return (
    <>
      <Button
        type="link"
        danger
        disabled={userId === resourceOnwerId || !userId}
        className="flex gap-[5px] items-start p-0"
        onClick={showModal}
      >
        <div className="flex items-center justify-center w-6 h-6 bg-red-200 rounded-full">
          <AlertOctagon size={16} />
        </div>
        <p>
          {type === "QUESTION"
            ? "Denúnciar pergunta"
            : type === "ANSWER"
              ? "Denúnciar resposta"
              : type === "QUIZ"
                ? "Denúnciar questionário"
                : ""}
        </p>
      </Button>
      <Modal
        title="Criar uma nova denúncia"
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            danger
            onClick={() => form.submit()}
          >
            Enviar
          </Button>,
        ]}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="reason"
            label="Motivo"
            rules={[
              {
                required: true,
                message: "Por favor, informe o motivo da denúncia",
              },
            ]}
          >
            <Select placeholder="Selecione o motivo">
              <Option value="SPAM">Spam</Option>
              <Option value="INAPROPRIADO">Conteúdo inapropriado</Option>
              <Option value="OFENSIVO">Conteúdo ofensivo</Option>
              <Option value="LINKS">Divulgação</Option>
              <Option value="OUTRO">Outro</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReportButton;
