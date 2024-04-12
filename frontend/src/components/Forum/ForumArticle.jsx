import { Avatar, Button, Spin } from "antd";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetForumQuestionsQuery } from "../../api/slices/forumApiSlice";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";
import { API_AVATAR } from "../../config";

export const ForumArticle = ({ selectedTab, searchTitle }) => {
  const navigate = useNavigate();
  const filter = {
    tagName: selectedTab,
    ...(searchTitle ? { title: searchTitle } : {}),
  };
  const {
    data: questionsData,
    error: questionError,
    isLoading: questionLoading,
    refetch,
  } = useGetForumQuestionsQuery(filter);

  useEffect(() => {
    refetch();
  }, [refetch, selectedTab]);

  let content;
  if (questionLoading) {
    content = <Spin tip="perguntas..." size="large" />;
  } else if (questionError) {
    content = <p>Erro: {questionError}</p>;
  } else if (questionsData) {
    if (questionsData.length > 0) {
      content = questionsData.map((question) => {
        const date = new Date(question.createdAt);
        const formattedDate = formatDistanceToNow(date, {
          addSuffix: true,
          locale: ptBR,
        });

        return (
          <div key={question.id}>
            <div className="bg-white rounded-t-[10px] flex flex-col gap-[10px] text-text p-[10px]">
              <p
                className="text-2xl font-medium truncate hover:whitespace-normal"
                id="title"
              >
                {question.title}
              </p>

              <div className="flex flex-row gap-1 ">
                <span className="px-3 py-0.5 rounded-xl bg-text bg-opacity-15">
                  {question.tag.name}
                </span>
              </div>
              <div className="flex items-end justify-between text-text">
                <div className="flex gap-2">
                  <Avatar
                    shape="circle"
                    size={42}
                    src={
                      question.user.avatar
                        ? API_AVATAR + question.user.avatar
                        : undefined
                    }
                    icon={
                      question.user.avatar ? undefined : (
                        <UserRound size={32} color="#333" strokeWidth={1.5} />
                      )
                    }
                  />
                  <div className="flex flex-col">
                    <p className="font-medium">{question.user.name}</p>
                    <span className="text-sm text-opacity-60">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex gap-2">
                    <span>{question.Answer.length} respostas</span>
                    <span>0 avaliações</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              className="w-full rounded-t-none"
              onClick={() => navigate(question.id)}
            >
              Ler mais
            </Button>
          </div>
        );
      });
    } else {
      content = <p>Seja o primeiro a criar uma pergunta nesta seção! 😉</p>;
    }
  }

  return content;
};
