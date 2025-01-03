import LayoutComponent from "./layout/LayoutComponent.jsx";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import {
  useGetLikeCountQuery,
  useGetUsersQuery,
  useRemoveUserMutation,
} from "../api/slices/profileApiSlice";
import {
  Edit3Icon,
  LogOut,
  ThumbsUp,
  Trash2Icon,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Empty, Modal, notification, Spin, Table } from "antd";
import UserLeague from "../components/UserLeague.jsx";
import ProfileForumActivities from "../components/Profile/ProfileForumActivities.jsx";

import coin from "../assets/coin.png";
import { useNavigate } from "react-router-dom";
import { QuickAccess } from "../components/Profile/QuickAccess.jsx";
import { API_AVATAR } from "../config/index.js";
import { useEffect } from "react";
import { useDeleteAvatarMutation } from "../api/slices/avatarApiSlice.js";
import { useGetReportsByUserIdQuery } from "../api/slices/reportApiSlice.js";
import QuizActivities from "../components/Profile/QuizActivities.jsx";
import CountUp from "react-countup";
import renderStatusBadge from "../components/Manage/RenderStatusBadge.jsx";
import Achievements from "../components/Profile/Achievements.jsx";
import LeagueProgressBar from "../components/Profile/LeagueProgressBar.jsx";

const { confirm } = Modal;

function Profile() {
  const badgeRequirements = [
    { name: "Topaz", moreThan: 0, nextLeague: "Rubi" },
    { name: "Rubi", moreThan: 10, nextLeague: "Esmeralda" },
    { name: "Esmeralda", moreThan: 20, nextLeague: "Ametista" },
    { name: "Ametista", moreThan: 30, nextLeague: "Diamante" },
    { name: "Diamante", moreThan: 40, nextLeague: null },
  ];

  const columns = [
    {
      title: "Tipo",
      dataIndex: "reportableType",
      key: "reportableType",
      render: (reportableType) =>
        reportableType === "QUESTION"
          ? "Pergunta"
          : reportableType === "ANSWER"
            ? "Resposta"
            : reportableType === "QUIZ"
              ? "Quiz"
              : reportableType,
    },
    {
      title: "Motivo",
      dataIndex: "reason",
      key: "reason",
      render: (reason) =>
        reason === "SPAM"
          ? "Spam"
          : reason === "INAPROPRIADO"
            ? "Conteúdo inapropriado"
            : reason === "OFENSIVO"
              ? "Conteúdo ofensivo"
              : reason === "LINKS"
                ? "Links"
                : "Outro",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      render: (description) => description || "Não fornecida",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusBadge(status),
    },
    {
      title: "Retorno",
      dataIndex: "message",
      key: "message",
      render: (message, record) =>
        record.status ? message || "Não fornecido" : "-",
    },
  ];

  const user = useSelector(selectCurrentUser);
  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUsersQuery(user?.id, {
    skip: !user,
  });

  const { data: likeCount, refetch: refetchLikes } = useGetLikeCountQuery(
    user?.id,
    {
      skip: !user,
    },
  );

  useEffect(() => {
    if (user) {
      refetchLikes();
    }
  }, [refetchLikes, user]);

  const {
    data: userReports,
    isLoading: isUserReportsLoading,
    refetch: refetchReports,
  } = useGetReportsByUserIdQuery(user?.id, {
    skip: !user,
  });

  useEffect(() => {
    if (user) {
      refetchReports();
    }
  }, [refetchReports, user]);

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
    if (user) {
      refetch();
    }
  }, [refetch, user]);

  let content;
  if (isLoading) {
    content = <Spin fullscreen />;
  } else if (error) {
    content = <p>Erro: {error.message}</p>;
  } else if (userData && likeCount) {
    const nextLeague = badgeRequirements.find(
      (league) => league.moreThan > likeCount.count,
    );
    const likesNeeded = nextLeague ? nextLeague.moreThan - likeCount.count : 0;

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
            <div className="flex gap-2">
              <p className="text-4xl font-semibold ">{userData.name}</p>
              <UserLeague leagueSize="medium" userId={userData.id} />
            </div>

            <div className="flex items-center gap-1">
              <ThumbsUp size={20} className="text-blue-500" />
              <CountUp
                end={likeCount.count || 0}
                duration={2}
                className="text-lg font-bold text-blue-500"
              />
              <p>
                {likeCount.count === 1
                  ? "Curtida recebida"
                  : "Curtidas recebidas"}
              </p>
            </div>
            {nextLeague && (
              <div className="flex items-center gap-1 ">
                <TrendingUp size={20} className="text-green-500" />
                <p>
                  Faltam{" "}
                  <span className="font-bold text-green-500">
                    {likesNeeded}
                  </span>{" "}
                  curtidas para a liga <b>{nextLeague.name}</b>
                </p>
              </div>
            )}

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
        <h2 className="text-text m-0 mt-4">
          Nível de permissão:{" "}
          <span className="bg-white px-2 rounded font-medium">
            {(userData.role === "ADMIN" && "Administrador") ||
              (userData.role === "ESTUDIOSO" && "Estudioso") ||
              (userData.role === "INICIANTE" && "Iniciante")}
          </span>
        </h2>

        <LeagueProgressBar likeCount={likeCount.count} />

        <h2 className="text-text m-0 mt-4">Conquistas</h2>
        <Achievements userId={user?.id} />

        <div className="flex items-center justify-between gap-8 text-text">
          <div className="w-1/2">
            <h2 className="m-0 mt-4">Atividades no fórum</h2>
            <ProfileForumActivities userId={user?.id} />
          </div>

          <div className="w-1/2">
            <h2 className="m-0 mt-4">Atividades no questionário</h2>
            <QuizActivities userId={user?.id} />
          </div>
        </div>

        <h2 className="text-text m-0 mt-4">Minhas denúncias:</h2>
        {isUserReportsLoading ? (
          <Spin />
        ) : userReports?.length > 0 ? (
          <Table
            dataSource={userReports}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 4,
              showSizeChanger: false,
            }}
          />
        ) : (
          <Empty
            description={"Você ainda não realizou uma denúncia"}
            className="bg-white rounded-[10px] py-2"
          />
        )}

        <h2 className="text-text m-0 mt-4">Acesso rápido</h2>
        <QuickAccess />
      </>
    );
  }

  return <LayoutComponent>{content}</LayoutComponent>;
}

export default Profile;
