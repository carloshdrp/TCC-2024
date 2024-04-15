import { useParams } from "react-router-dom";
import { Breadcrumb, Spin, Avatar, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LayoutComponent from "./layout/LayoutComponent";
import { useGetForumQuestionQuery } from "../api/slices/forumApiSlice";
import { AlertOctagon, ThumbsUp, UserRound } from "lucide-react";
import { API_AVATAR } from "../config";
import UserLeague from "../components/UserLeague";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ForumQuestion = () => {
  const { questionId } = useParams();

  const {
    data: questionData,
    error: questionError,
    isLoading: questionLoading,
  } = useGetForumQuestionQuery(questionId);

  const navigate = useNavigate();

  let content;
  if (questionLoading) {
    content = <Spin fullscreen />;
  } else if (questionError) {
    content = <p>Erro: {questionError}</p>;
  } else if (questionData) {
    const dateCreate = new Date(questionData.createdAt);
    const createDataFormatted = formatDistanceToNow(dateCreate, {
      locale: ptBR,
    });
    const dateUpdate = new Date(questionData.updatedAt);
    const updatedDataFormatted = formatDistanceToNow(dateUpdate, {
      locale: ptBR,
    });

    const topMenu = [
      {
        onClick: () => navigate("/"),
        href: null,
        title: <HomeOutlined />,
      },
      {
        onClick: () => navigate("/forum"),
        href: null,
        title: "Fórum",
      },
      {
        onClick: () => navigate("/forum"),
        href: null,
        title: questionData.tag.name,
      },
      {
        href: null,
        title: questionData.id,
      },
    ];

    content = (
      <LayoutComponent>
        <div className="flex flex-col gap-[20px]">
          <Breadcrumb items={topMenu} />

          <div
            key={questionData.id}
            className="bg-white text-text p-[10px] rounded-[10px] flex flex-col gap-[10px]"
          >
            <h1 className="m-0 text-2xl font-medium">{questionData.title}</h1>
            <p className="px-[10px] bg-background rounded-[10px] w-fit">
              {questionData.tag.name}
            </p>
            <p>{questionData.description}</p>
            <span className="bg-text w-full h-[1.5px] bg-opacity-10 rounded-full" />

            <div className="flex">
              <div className="flex gap-[10px]">
                <Avatar
                  shape="circle"
                  size={55}
                  src={
                    questionData.user.avatar
                      ? API_AVATAR + questionData.user.avatar
                      : undefined
                  }
                  icon={
                    questionData.user.avatar ? undefined : (
                      <UserRound size={40} strokeWidth={1.5} />
                    )
                  }
                />
                <div className="flex flex-col justify-between ">
                  <p className="text-xl">{questionData.user.name}</p>
                  <UserLeague
                    leagueSize="small"
                    userId={questionData.user.id}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between gap-[10px] items-end w-full">
                <p className="text-sm opacity-60">
                  Pergunta criada: {createDataFormatted} atrás
                </p>
                <p className="text-sm opacity-60">
                  Última modificação: {updatedDataFormatted} atrás
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                type="link"
                danger
                className="flex gap-[5px] items-start p-0"
              >
                <div className="flex items-center justify-center w-6 h-6 bg-red-200 rounded-full">
                  <AlertOctagon size={16} />
                </div>
                <p>Reportar essa pergunta</p>
              </Button>
              <div className="flex gap-[5px] items-center">
                <Button type="link" className="flex gap-[5px] items-start p-0">
                  <div className="flex items-center justify-center w-7 h-7 bg-secondary bg-opacity-30 rounded-[10px]">
                    <ThumbsUp
                      size={20}
                      color="#FFF"
                      fill="rgba(255, 64, 129, 0.30)"
                    />
                  </div>
                </Button>
                <p>0 Curtidas</p>
              </div>
            </div>
          </div>
          <p>Nenhuma resposta</p>
          <Button type="primary">Adicionar uma resposta</Button>
        </div>
      </LayoutComponent>
    );
  }

  return content;
};
