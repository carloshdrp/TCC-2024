import { Layout, Typography, Avatar } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Title } = Typography;
const { Header, Footer, Content } = Layout;
import "../../styles/layout.css";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { API_AVATAR, APP_NAME } from "../../config";

import PropTypes from "prop-types";
import { selectCurrentUser } from "../../redux/slices/authSlice";

const LayoutComponent = ({ children }) => {
  const user = useSelector(selectCurrentUser);

  const location = useLocation();
  const titles = {
    "/forum": "Fórum",
    "/pratice": "Praticar",
    "/login": "Entrar",
    "/register": "Registrar",
    "/contact": "Contato",
    "/profile": "Perfil",
  };

  useEffect(() => {
    const title = titles[location.pathname];
    document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;
  }, [location]);
  return (
    <Layout className="min-h-[100vh]">
      <Header className="top-0 flex w-full h-32 items-center justify-between z-1 px-[90px] bg-transparent">
        <div>
          <Title level={2}>
            <Link to="/" style={{ color: "#333" }}>
              🚀 {APP_NAME}
            </Link>
          </Title>
        </div>

        <div id="nav-container">
          <Link to="/">
            Início <ArrowRight />
          </Link>
          <Link to="/forum">
            Fórum <ArrowRight />
          </Link>
          <Link to="/exercises">
            Exercícios <ArrowRight />
          </Link>
        </div>

        <div className="flex items-center justify-center h-[30px] ">
          {user ? (
            <Link
              to="/profile"
              className="text-black mr-[15px] hover:text-black  flex items-center px-2 gap-2"
            >
              <Avatar
                size="large"
                src={user.avatar ? API_AVATAR + user.avatar : undefined}
                icon={!user.avatar && <UserRound />}
              />
              {user.name}
            </Link>
          ) : (
            <Link to="/login" className="text-black mr-[15px] hover:text-black">
              Entrar
            </Link>
          )}
          <Link to="/contact" className="btn-nav hover:text-primary">
            Contato
            <div className="btn-nav-icon">
              <ArrowUpRight size="16" color="white" className="absolute" />
            </div>
          </Link>
        </div>
      </Header>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        <Content className="px-[90px]">{children}</Content>
      </motion.div>

      <Footer className="px-[90px] text-center">{APP_NAME} • 2024</Footer>
    </Layout>
  );
};

LayoutComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutComponent;
