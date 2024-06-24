import LayoutComponent from "./layout/LayoutComponent.jsx";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import {
  useGetUsersQuery,
  useRemoveUserMutation,
} from "../api/slices/profileApiSlice";
import {
  Archive,
  Edit3Icon,
  LogOut,
  Trash2Icon,
  UserRound,
} from "lucide-react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Modal, notification, Spin } from "antd";
import UserLeague from "../components/UserLeague.jsx";
import ProfileForumActivities from "../components/Profile/ProfileForumActivities.jsx";

import coin from "../assets/coin.png";
import { useNavigate } from "react-router-dom";
import { QuickAccess } from "../components/Profile/QuickAccess.jsx";
import { API_AVATAR } from "../config/index.js";
import { useEffect } from "react";
import { useDeleteAvatarMutation } from "../api/slices/avatarApiSlice.js";
import QuizActivities from "../components/Profile/QuizActivities.jsx";
import CountUp from "react-countup";

const { confirm } = Modal;

function Profile() {
  const user = useSelector(selectCurrentUser);
  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUsersQuery(user.id);
  const navigate = useNavigate();

  const [removeUser] = useRemoveUserMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const showConfirm = () => {
    confirm({
      title: "Você tem certeza?",
      icon: <ExclamationCircleFilled />,
      content:
        "Uma vez que deletar sua conta, não poderá recuperá-la e seus dados serão apagados.",
      onText: "Deletar",
      okType: "danger",
      cancelText: "Cancelar",
      width: 600,
      onOk: async () => {
        try {
          if (user.avatar) {
            await deleteAvatar(user.avatar);
          }

          await removeUser(user.id);

          notification.success({
            message: "Conta deletada com sucesso!",
            description: "É uma pena ver você ir embora. Até mais... 👋 ",
          });

          navigate("/logout");
        } catch (error) {
          notification.error({
            message: "Erro ao deletar conta",
            description:
              "Ocorreu um erro ao tentar deletar sua conta. Por favor, tente novamente.",
          });
          console.log("erro:", error);
        }
      },
    });
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  let content;
  if (isLoading) {
    content = <Spin fullscreen />;
  } else if (error) {
    content = <p>Erro: {error}</p>;
  } else if (userData) {
    content = (
      <>
        <header className="flex gap-3 p-3  rounded-xl text-text">
          <Avatar
            shape="square"
            size={150}
            src={userData.avatar ? API_AVATAR + userData.avatar : undefined}
            icon={!userData.avatar && <UserRound size={46} />}
          />
          <div className="flex flex-col justify-between w-full">
            <p className="text-4xl font-semibold ">{userData.name}</p>
            <UserLeague leagueSize="medium" userId={userData.id} />
            <div className="flex items-center gap-1">
              {userData.role === "ADMIN" ? (
                <p className="text-red-400">
                  Os pontos não estão disponíveis para administradores
                </p>
              ) : (
                <>
                  <img src={coin} alt="coin" className="w-5 h-5" />
                  <CountUp
                    end={userData.points}
                    duration="2"
                    className="text-lg font-black text-yellow-500"
                  />
                  <p>
                    {userData.points === 1 ? "Ponto total" : "Pontos totais"}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-2">
            <Button
              type="primary"
              onClick={() => navigate("edit")}
              className="flex items-center justify-center gap-2"
            >
              <Edit3Icon size={16} />
              Editar Perfil
            </Button>
            <Button
              onClick={() => navigate("/logout")}
              className="flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sair da Conta
            </Button>
            <Button
              danger
              onClick={showConfirm}
              className="flex items-center justify-center gap-2"
            >
              <Trash2Icon size={16} />
              Excluir Conta
            </Button>
          </div>
        </header>

        {userData.role === "ADMIN" && (
          <Button
            type="primary"
            className="w-full"
            onClick={() => navigate("/manage")}
          >
            Painel de administração
          </Button>
        )}

        <h2 className="text-text m-0 mt-4" id="conquistas">
          Suas conquistas
        </h2>
        <div className="grid items-center justify-center w-full grid-flow-col bg-white rounded-lg min-h-32">
          <div className="flex flex-col items-center justify-center p-2">
            <Archive size={96} opacity="70%" strokeWidth={1.5} />
            <p className="opacity-70">
              Botar as conquistas aqui e colocar os requisitos para ganhar
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-8 text-text">
          <div className="w-1/2">
            <h2 className="m-0 mt-4">Atividades no fórum</h2>
            <ProfileForumActivities userId={user?.id} />
          </div>

          <div className="w-1/2">
            <h2 className="m-0 mt-4">Atividades no Questionário</h2>
            <QuizActivities userId={user?.id} />
          </div>
        </div>

        <h2 className="text-text m-0 mt-4">Acesso rápido</h2>
        <QuickAccess />
      </>
    );
  }

  return <LayoutComponent>{content}</LayoutComponent>;
}

export default Profile;
