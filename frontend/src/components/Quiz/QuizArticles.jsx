import { subjects } from "../../utils/quizSubjects.jsx";
import { Avatar, Dropdown, Modal, notification, Rate, Spin } from "antd";
import { Dot, UserRound } from "lucide-react";
import {
  useDeleteQuizMutation,
  useGetQuizzesQuery,
} from "../../api/slices/quizApiSlice.js";
import { normalizeSubject } from "../../utils/normalizeSubject.js";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { API_AVATAR } from "../../config/index.js";
import { useGetRatingByRateableTypeQuery } from "../../api/slices/ratingApiSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice.js";
import { EllipsisOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  addQuestion,
  setEditing,
  setQuiz,
} from "../../redux/slices/quizCreateSlice.js";
import { useDeleteQuizQuestionMutation } from "../../api/slices/quizQuestionApiSlice.js";
import { useDeleteQuizRelationMutation } from "../../api/slices/quizRelationApiSlice.js";

const QuizArticles = ({ menuTab, searchTitle }) => {
  const userState = useSelector(selectCurrentUser);

  const { confirm } = Modal;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filter = {
    ...(searchTitle ? { title: searchTitle } : {}),
    sortBy: "desc",
  };
  if (menuTab !== undefined && menuTab !== "Seus questionários") {
    filter.subject = menuTab;
  }

  if (menuTab === "Seus questionários") {
    filter.userId = userState.id;
  }

  const {
    data: quizzesData,
    error: quizzesError,
    isLoading: quizzesLoading,
    refetch,
  } = useGetQuizzesQuery(filter);

  const {
    data: ratingData,
    refetch: refreshRating,
    isLoading: ratingLoading,
  } = useGetRatingByRateableTypeQuery("QUIZ");

  const [quizId, setQuizId] = useState({});

  const [deleteQuiz] = useDeleteQuizMutation();
  const [deleteQuizQuestion] = useDeleteQuizQuestionMutation();
  const [deleteQuizRelation] = useDeleteQuizRelationMutation();

  useEffect(() => {
    refreshRating();
  }, [refreshRating]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (quizId?.Question?.length === 0) {
      deleteQuiz(quizId.id)
        .then(() => {
          notification.success({
            message: "Questionário excluído com sucesso!",
            description:
              "O questionário e as questões associadas a ele foram apagadas.",
          });
          setQuizId({});
        })
        .catch((error) => {
          notification.error({
            message: "Erro ao deletar questionário",
            description:
              "Ocorreu um erro ao tentar deletar o questionário. Por favor, tente novamente.",
          });
          console.log(error);
        })
        .finally(() => {
          refetch();
        });
    }
  }, [quizId, deleteQuiz, refetch]);

  let content;
  if (quizzesLoading) {
    content = (
      <Spin
        tip="Buscando questionários..."
        size="large"
        className="rounded-[10px] bg-white bg-opacity-100"
      >
        <div className="w-full h-24 mt-11 " />
      </Spin>
    );
  } else if (quizzesError) {
    content = <p>Erro: {quizzesError.data.message}</p>;
  } else if (quizzesData) {
    if (quizzesData.length > 0) {
      content = quizzesData.map((quiz) => {
        const subject = subjects.find(
          (item) => item.text === normalizeSubject(quiz.subject),
        );
        const date = new Date(quiz.createdAt);
        const formattedDate = formatDistanceToNow(date, {
          addSuffix: true,
          locale: ptBR,
        });

        let ratingCount;
        if (ratingLoading) {
          ratingCount = <Spin />;
        } else if (ratingData) {
          ratingCount = ratingData.filter(
            (rating) => rating.rateableId === quiz.id,
          ).length;
        }

        const showConfirm = () => {
          confirm({
            title: "Você tem certeza?",
            icon: <ExclamationCircleFilled />,
            content:
              "Uma vez que deletar o questionário, não poderá recuperá-lo e todos os dados serão apagados.",
            onText: "Deletar",
            okType: "danger",
            cancelText: "Voltar",
            width: 600,
            onOk: async () => {
              try {
                await deleteQuizRelation(quiz.id);
                await quiz.Question.forEach((question) => {
                  deleteQuizQuestion({
                    quizId: quiz.id,
                    quizQuestionId: question.id,
                  });
                });
                setQuizId(quiz);
              } catch (error) {
                notification.error({
                  message: "Erro ao deletar questionário",
                  description:
                    "Ocorreu um erro ao tentar deletar o questionário. Por favor, tente novamente.",
                });
              }
            },
          });
        };

        const settings = [
          {
            key: "edit",
            label: "Editar",
            onClick: () => {
              dispatch(setQuiz(quiz));
              quiz.Question.forEach((question) => {
                dispatch(addQuestion(question));
              });
              dispatch(setEditing(true));

              navigate("create");
            },
          },
          {
            key: "delete",
            label: "Deletar",
            danger: true,
            onClick: showConfirm,
          },
        ];

        return (
          <article
            key={quiz.id}
            className="flex flex-col gap-[5px] px-[10px] py-[5px] text-text my-[5px]"
          >
            <div className="flex justify-between">
              <h2
                className=" font-medium text-[20px] m-0 cursor-pointer hover:underline"
                onClick={() => console.log("oi")}
              >
                {quiz.title}
              </h2>
              {userState && quiz.user.id === userState.id && (
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

            <div className="flex justify-between">
              <div className="flex gap-[5px]">
                {subject.icon}
                <p>
                  {subject.text} - {quiz.Question.length}{" "}
                  {quiz.Question.length <= 1 ? "questão" : "questões"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Rate disabled defaultValue={quiz.difficulty} allowHalf />
                <p className="text-[#EABF28]">
                  {quiz.difficulty === null
                    ? "N.A."
                    : quiz.difficulty > 0 && quiz.difficulty < 2
                      ? "Fácil"
                      : quiz.difficulty >= 2 && quiz.difficulty < 4
                        ? "Médio"
                        : "Difícil"}
                </p>
              </div>
            </div>
            <p>{quiz.description}</p>
            <span className="bg-text w-full h-[1px] bg-opacity-20 rounded-full" />
            <footer>
              <div className="flex justify-between text-sm items-center">
                <div className="flex items-center">
                  <Avatar
                    shape="circle"
                    size={24}
                    src={
                      quiz.user.avatar ? API_AVATAR + quiz.user.avatar : null
                    }
                    className="mr-1"
                    icon={
                      quiz.user.avatar ? null : (
                        <UserRound size={20} strokeWidth={1.5} />
                      )
                    }
                  />
                  <p>{quiz.user.name}</p>
                  <Dot opacity="50%" />
                  <p>{formattedDate}</p>
                </div>
                {ratingCount >= 1 ? (
                  <p>{ratingCount} Curtidas</p>
                ) : (
                  <p>{ratingCount} Curtida</p>
                )}
              </div>
            </footer>
          </article>
        );
      });
    } else {
      content = searchTitle ? (
        <p className="mt-1">
          Não foi possível encontrar um questionário com um título igual a{" "}
          <span className="px-0.5 rounded bg-gray-200">{searchTitle}</span>{" "}
          {menuTab ? `na categoria ${normalizeSubject(menuTab)} 😢` : "😢"}
        </p>
      ) : menuTab === "Seus questionários" ? (
        <p className="mt-1">Você ainda não criou nenhum questionário! 😢</p>
      ) : (
        <p className="mt-1">
          Seja o primeiro a criar um questionário para esta matéria! 😉
        </p>
      );
    }
  }
  return content;
};

export default QuizArticles;
