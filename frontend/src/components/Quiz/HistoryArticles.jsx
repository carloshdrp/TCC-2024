import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteQuizFeedbackMutation,
  useGetQuizzesFeedbacksQuery,
} from "../../api/slices/quizFeedbackApiSlice.js";
import { selectCurrentUser } from "../../redux/slices/authSlice.js";
import { Button, Empty, Modal, notification, Spin } from "antd";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useDeleteQuizQuestionAnswerMutation } from "../../api/slices/quizQuestionAnswersApiSlice.js";
import { TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HistoryArticles = () => {
  const userState = useSelector(selectCurrentUser);

  const navigate = useNavigate();

  const { confirm } = Modal;

  const {
    data: attemptsData,
    isLoading: attemptsLoading,
    refetch,
  } = useGetQuizzesFeedbacksQuery({
    userId: userState?.id,
    sortBy: "desc",
  });

  const [deleteQuizQuestionAnswer] = useDeleteQuizQuestionAnswerMutation();
  const [deleteQuizFeedback, { data: deleteFeedbackData }] =
    useDeleteQuizFeedbackMutation();

  useEffect(() => {
    refetch();
  }, [refetch, deleteFeedbackData]);

  let content;
  if (attemptsLoading) {
    content = (
      <Spin tip="Carregando..." className="bg-white rounded-lg">
        <div className="h-20 " />
      </Spin>
    );
  } else if (attemptsData) {
    if (attemptsData.length === 0) {
      content = (
        <Empty
          description={<p>Você ainda não completou nenhum questionário.</p>}
          className="mt-4"
        />
      );
    } else {
      content = attemptsData.map((attempt) => {
        const date = new Date(attempt.createdAt);
        const formattedDate = formatDistanceToNow(date, {
          addSuffix: true,
          locale: ptBR,
        });

        const deleteQuizQuestionAnswers = async () => {
          try {
            await Promise.all(
              attempt.QuizQuestionAnswer.map((answer) => {
                return deleteQuizQuestionAnswer({ quizQuestionId: answer.id });
              }),
            ).then(() => {
              deleteQuizFeedback({ feedbackId: attempt.id });
            });
          } catch (e) {
            throw new Error(e.message);
          }
        };

        const handleDelete = async () => {
          confirm({
            title: "Tem certeza que deseja excluir?",
            content:
              "Uma vez excluído do histórico, o resultado não poderá ser recuperado.",
            icon: <ExclamationCircleFilled />,
            onOk() {
              deleteQuizQuestionAnswers().then(() => {
                notification.success({
                  message: "Questionário excluído",
                  description:
                    "O questionário foi excluído com sucesso do seu histórico!",
                });
              });
            },
            okText: "Sim",
            okType: "danger",
            cancelText: "Cancelar",
          });
        };

        const correctChoicesCount = attempt.QuizQuestionAnswer.filter(
          (answer) => answer.choice === "correct",
        ).length;

        let difficulty;
        switch (attempt.score) {
          case 1:
            difficulty = "Muito fácil";
            break;
          case 2:
            difficulty = "Fácil";
            break;
          case 3:
            difficulty = "Médio";
            break;
          case 4:
            difficulty = "Difícil";
            break;
          case 5:
            difficulty = "Muito difícil";
            break;
          default:
            difficulty = "Não avaliado";
        }

        return (
          <div
            key={attempt.id}
            className="border-b-2 border-0 border-solid border-b-black border-opacity-10"
          >
            <div className="flex justify-between items-center">
              <h1
                className="m-0 mt-4 hover:underline hover:cursor-pointer"
                onClick={() => navigate(`/exercises/result/${attempt.id}`)}
              >
                {attempt.quiz.title}
              </h1>
              <p>{formattedDate}</p>
            </div>
            <p>
              <b>Avaliação:</b> {difficulty}
            </p>
            <div className="flex justify-between items-center">
              <p>
                <b>Respostas certas:</b> {correctChoicesCount}/
                {attempt.QuizQuestionAnswer.length}
              </p>
              <Button
                type="link"
                danger
                className="w-fit flex items-center pr-0 gap-1"
                onClick={handleDelete}
              >
                <TrashIcon size={14} />
                excluir
              </Button>
            </div>
          </div>
        );
      });
    }
  }
  return content;
};

export default HistoryArticles;
