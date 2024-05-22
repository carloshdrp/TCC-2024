import { Avatar, Button, Dropdown, Spin } from "antd";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetForumQuestionsQuery } from "../../api/slices/forumApiSlice";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";
import { API_AVATAR } from "../../config";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import { EllipsisOutlined } from "@ant-design/icons";
import { useGetRatingByRateableTypeQuery } from "../../api/slices/ratingApiSlice";
import PropTypes from "prop-types";

export const ForumArticle = ({ selectedTab, searchTitle }) => {
  const navigate = useNavigate();
  const userData = useSelector(selectCurrentUser);

  const filter = {
    tagName: selectedTab,
    ...(searchTitle ? { title: searchTitle } : {}),
    sortBy: "desc",
  };

  const {
    data: questionsData,
    error: questionError,
    isLoading: questionLoading,
    refetch,
  } = useGetForumQuestionsQuery(filter);

  const {
    data: ratingData,
    refetch: refreshRating,
    isLoading: ratingLoading,
  } = useGetRatingByRateableTypeQuery("QUESTION");

  useEffect(() => {
    refreshRating();
  }, [refreshRating]);

  useEffect(() => {
    refetch();
  }, [refetch, selectedTab]);

  let content;
  if (questionLoading) {
    content = (
      <Spin
        tip="Buscando perguntas..."
        size="large"
        className="rounded-[10px] bg-white bg-opacity-100"
      >
        <div className="w-full h-24 mt-11 " />
      </Spin>
    );
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

        let ratingCount;
        if (ratingLoading) {
          ratingCount = <Spin />;
        } else if (ratingData) {
          ratingCount = ratingData.filter(
            (rating) => rating.rateableId === question.id,
          ).length;
        }

        const settings = [
          {
            key: "edit",
            label: "Editar",
            onClick: () => navigate(`${question.id}/edit`),
          },
          {
            key: "delete",
            label: "Deletar",
            danger: true,
            onClick: () => navigate(`${question.id}/delete`),
          },
        ];

        return (
          <div key={question.id}>
            <div className="bg-white rounded-t-[10px] flex flex-col gap-[10px] text-text p-[10px]">
              <div className="flex justify-between">
                <p
                  className="text-2xl font-medium truncate hover:whitespace-normal"
                  id="title"
                >
                  {question.title}
                </p>
                {userData && question.user.id === userData.id && (
                  <Dropdown
                    menu={{
                      items: settings,
                    }}
                    trigger={["click"]}
                    className="cursor-pointer"
                  >
                    <EllipsisOutlined className="px-2 text-xl rounded-md text-text hover:bg-background " />
                  </Dropdown>
                )}
              </div>

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
                        <UserRound size={32} strokeWidth={1.5} />
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
                    {question.Answer.length > 1 ? (
                      <span>{question.Answer.length} Respostas</span>
                    ) : (
                      <span>{question.Answer.length} Resposta</span>
                    )}
                    {ratingCount > 1 ? (
                      <span>{ratingCount} Curtidas</span>
                    ) : (
                      <span>{ratingCount} Curtida</span>
                    )}
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
      content = searchTitle ? (
        <p>
          Não foi possível encontrar uma pergunta com um título igual a{" "}
          <span className="px-0.5 rounded bg-gray-200">{searchTitle}</span>{" "}
          nesta categoria 😢
        </p>
      ) : (
        <p>Seja o primeiro a criar uma pergunta nesta seção! 😉</p>
      );
    }
  }

  return content;
};

ForumArticle.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  searchTitle: PropTypes.string,
};
ForumArticle.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  searchTitle: PropTypes.string,
};
