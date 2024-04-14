import LayoutComponent from "./layout/LayoutComponent.jsx";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import {
  useGetUsersQuery,
  useRemoveUserMutation,
} from "../api/slices/profileApiSlice";
import { UserRound, Archive } from "lucide-react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Spin, Modal, notification } from "antd";
import UserLeague from "../components/UserLeague.jsx";
import UserRanking from "../components/UserRanking.jsx";
import coin from "../assets/coin.png";
import { useNavigate } from "react-router-dom";
import { QuestionsOverview } from "../components/QuestionsOverview.jsx";
import { API_AVATAR } from "../config/index.js";
import { useEffect } from "react";
import { useDeleteAvatarMutation } from "../api/slices/avatarApiSlice.js";

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
        <header className="flex gap-3 p-3 bg-white shadow-md rounded-xl text-text">
          <Avatar
            shape="square"
            size={150}
            src={userData.avatar ? API_AVATAR + userData.avatar : undefined}
            icon={!userData.avatar && <UserRound size={46} />}
          />
          <div className="flex flex-col justify-between w-full">
            <p className="text-4xl font-semibold ">{userData.name}</p>
            <UserLeague leagueSize="medium" userId={userData.id} />
            <UserRanking />
            <div className="flex items-center gap-1">
              <img src={coin} alt="coin" className="w-5 h-5" />
              <span className="text-lg font-black text-yellow-500">
                {userData.points}
              </span>
              <p>Pontos totais</p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-2">
            <Button type="primary" onClick={() => navigate("edit")}>
              Editar Perfil
            </Button>
            <Button type="default" onClick={() => navigate("/logout")}>
              Sair da Conta
            </Button>
            <Button type="link" danger onClick={showConfirm}>
              Excluir Conta
            </Button>
          </div>
        </header>

        <h2 className="text-text">Suas conquistas</h2>
        <div className="grid items-center justify-center w-full grid-flow-col bg-white rounded-lg shadow-md min-h-32">
          <div className="flex flex-col items-center justify-center p-2">
            <Archive size={96} opacity="70%" strokeWidth={1.5} />
            <p className="opacity-70">
              Botar as conquistas aqui e colocar os requisitos para ganhar
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-8 text-text">
          <div className="w-1/2">
            <h2>Atividades no Fórum</h2>
            <div className="grid grid-flow-col p-2 text-center bg-white rounded-lg shadow-md">
              <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
                <h3 className="m-0">Questões Abertas</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
              <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
                <h3 className="m-0">Questões Respondidas</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
              <div>
                <h3 className="m-0">Avaliações</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <h2>Atividades no Questionário</h2>
            <div className="grid grid-flow-col p-2 text-center bg-white rounded-lg shadow-md">
              <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
                <h3 className="m-0">Questionários Criados</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
              <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
                <h3 className="m-0">Questionários Realizados</h3>
                <p className="text-4xl font-black "> 0</p>
              </div>
              <div>
                <h3 className="m-0">Avaliações</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-text">Suas questões no fórum</h2>
        <QuestionsOverview />
      </>
    );
  }

  return <LayoutComponent>{content}</LayoutComponent>;
}

export default Profile;
