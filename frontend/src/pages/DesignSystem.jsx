import React from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

const AntDesignShowcase = () => {
  const openSuccessNotification = () => {
    notification.success({
      message: "Sucesso",
      description: "Operação realizada com sucesso.",
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: "Erro",
      description: "Ocorreu um erro na operação.",
    });
  };

  return (
    <div className="ant-showcase">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Botões" size="small">
            <Button type="primary" className="mr-2">
              Primário
            </Button>
            <Button className="mr-2">Padrão</Button>
            <Button type="dashed" className="mr-2">
              Tracejado
            </Button>
            <Button type="link" className="mr-2">
              Link
            </Button>
            <Button type="primary" danger>
              Perigo
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Inputs" size="small">
            <Form layout="vertical">
              <Form.Item label="Padrão" name="default" hasFeedback>
                <Input placeholder="Input padrão" />
              </Form.Item>
              <Form.Item
                label="Obrigatório"
                name="default"
                rules={[{ required: true, message: "Campo obrigatório" }]}
                hasFeedback
              >
                <Input placeholder="Input Obrigatório" />
              </Form.Item>
              <Form.Item
                label="Com erro"
                name="error"
                validateStatus="error"
                help="Mensagem de erro"
                hasFeedback
              >
                <Input placeholder="Input com erro" />
              </Form.Item>
              <Form.Item
                label="Sucesso"
                name="success"
                validateStatus="success"
                hasFeedback
              >
                <Input placeholder="Input com sucesso" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Select" size="small">
            <Select
              defaultValue="option1"
              style={{ width: "100%" }}
              open={true}
            >
              <Option value="option1">Opção 1</Option>
              <Option value="option2">Opção 2</Option>
            </Select>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Checkbox e Radio button" size="small">
            <div className="mb-2">
              <Checkbox>Checkbox</Checkbox>
              <Checkbox checked>Checkbox2</Checkbox>
            </div>
            <Radio.Group defaultValue="a">
              <Radio value="a">A</Radio>
              <Radio value="b">B</Radio>
              <Radio value="c">C</Radio>
            </Radio.Group>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Outros" size="small" className="mt-10">
            <Switch defaultChecked className="mr-2" />
            <Switch className="mr-2" />
            <Button onClick={openSuccessNotification} className="mr-2 ml-2">
              Notificação de Sucesso
            </Button>
            <Button onClick={openErrorNotification}>Notificação de Erro</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AntDesignShowcase;
