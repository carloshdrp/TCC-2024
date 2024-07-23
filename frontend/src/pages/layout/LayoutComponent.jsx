import { Avatar, Layout, Spin, Typography } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../styles/layout.css";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { API_AVATAR, APP_NAME } from "../../config";
import ScrollTop from "../../components/ScrollTop";
import logo from "../../assets/foguete.png";

import PropTypes from "prop-types";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import Notifications from "../../components/Profile/Notification.jsx";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const LayoutComponent = ({ children, quizName }) => {
  const user = useSelector(selectCurrentUser);
  const { exerciseId } = useParams();

  const location = useLocation();
  const titles = {
    "/forum": "Fórum",
    "/exercises": "Questionários",
    "/exercises/create": "Criar Questionário",
    "/exercise/": quizName,
    "/login": "Entrar",
    "/register": "Registrar",
    "/about": "Conhecer",
    "/profile": "Perfil",
  };

  useEffect(() => {
    const title = titles[location.pathname];
    document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;
    if (location.pathname === "/exercise/" + exerciseId && quizName) {
      document.title = `${quizName} - ${APP_NAME}`;
    }
  }, [location, quizName]);

  if (!children) {
    return <Spin fullscreen />;
  }

  return (
    <Layout>
      <Header className="top-0 flex w-full h-32 items-center justify-between z-1 px-[90px] mx-auto  max-w-[1440px] bg-transparent">
        <Title level={2} className="m-0 !mb-0 text-text">
          <Link
            to="/"
            style={{ color: "#333" }}
            className="flex items-center gap-2"
          >
            <img src={logo} alt="logo" className="w-9 h-9" /> {APP_NAME}
          </Link>
        </Title>

        <div id="nav-container">
          <Link to="/">
            Início <ArrowRight />
          </Link>
          <Link to="/forum">
            Fórum <ArrowRight />
          </Link>
          <Link to="/exercises">
            Questionários <ArrowRight />
          </Link>
        </div>

        <div className="flex items-center justify-center h-[30px] ">
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-black  hover:text-black flex items-center px-2 gap-2"
              >
                <Avatar
                  size="large"
                  src={user.avatar ? API_AVATAR + user.avatar : undefined}
                  icon={!user.avatar && <UserRound />}
                />
                {user.name}
              </Link>
              <Notifications />
            </>
          ) : (
            <Link to="/login" className="text-black mr-[15px] hover:text-black">
              Entrar
            </Link>
          )}
          <Link to="/about" className="btn-nav hover:text-primary ml-[15px]">
            Recursos
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
        <Content className="px-[90px] mx-auto min-h-[calc(100vh-200px)] max-w-[1440px]">
          {children}
        </Content>
      </motion.div>

      <Footer className="px-[90px] text-center">{APP_NAME} • 2024</Footer>
      <ScrollTop />
    </Layout>
  );
};

LayoutComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutComponent;
