import { Layout, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;
const { Header, Footer, Content } = Layout;
import "../../styles/layout.css";
import { ArrowUpRight } from "lucide-react";

import PropTypes from "prop-types";

const LayoutComponent = ({ children }) => {
  return (
    <Layout className="h-[100vh]">
      <Header className="top-0 flex w-full h-32 items-center justify-between z-1 px-[90px] bg-transparent">
        <div>
          <Title level={2}>
            <Link to="/" style={{ color: "#333" }}>
              🚀 Nome
            </Link>
          </Title>
        </div>

        <div
          className="flex items-center justify-center gap-3"
          id="nav-container"
        >
          <Link to="/" className="active">
            Início
          </Link>
          <Link to="/">Fórum</Link>
          <Link to="/">Praticar</Link>
        </div>

        <div className="flex items-center justify-center h-[30px]">
          <Link to="/login" className="text-black mr-[15px]">
            Entrar
          </Link>
          <Link
            to="/"
            className="px-[10px] py-[5px] gap-[2px] flex flex-row items-center"
          >
            Contato
            <div className="w-[20px] h-[20px] bg-primary relative flex items-center justify-center rounded-full">
              <ArrowUpRight size="16" color="white" className="absolute" />
            </div>
          </Link>
        </div>
      </Header>
      <Content className="px-[90px]">{children}</Content>
      <Footer className="px-[90px] text-center">Nome • 2023</Footer>
    </Layout>
  );
};

LayoutComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutComponent;
