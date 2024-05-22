import LayoutComponent from "./layout/LayoutComponent.jsx";
import {
  useDeleteQuizMutation,
  useGetQuizQuery,
} from "../api/slices/quizApiSlice.js";
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Modal,
  notification,
  Rate,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { subjects } from "../utils/quizSubjects.jsx";
import { normalizeSubject } from "../utils/normalizeSubject.js";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useGetRatingByRateableIdQuery,
} from "../api/slices/ratingApiSlice.js";
import { useEffect, useState } from "react";
import { API_AVATAR } from "../config/index.js";
import { AlertOctagon, ThumbsUp, UserRound } from "lucide-react";
import {
  EllipsisOutlined,
  ExclamationCircleFilled,
  HomeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setMenuTab } from "../redux/slices/quizMenuSlice.js";
import UserLeague from "../components/UserLeague.jsx";
import { selectCurrentUser } from "../redux/slices/authSlice.js";
import {
  addQuestion,
  setEditing,
  setQuiz,
} from "../redux/slices/quizCreateSlice.js";
import { useDeleteQuizQuestionMutation } from "../api/slices/quizQuestionApiSlice.js";
import { useDeleteQuizRelationMutation } from "../api/slices/quizRelationApiSlice.js";
import {
  useDeleteQuizFeedbackMutation,
  useGetQuizFeedbackQuery,
  useGetQuizScoreQuery,
} from "../api/slices/quizFeedbackApiSlice.js";
import { clearQuizPractice } from "../redux/slices/quizPracticeSlice.js";

const ExerciseLanding = () => {
  const { exerciseId } = useParams();

  const userState = useSelector(selectCurrentUser);

  const [processingLike, setProcessingLike] = useState(false);

  const { data: quiz, isLoading, error, refetch } = useGetQuizQuery(exerciseId);

  const {
    data: quizScore,
    isLoading: scoreLoading,
    refetch: refreshScore,
  } = useGetQuizScoreQuery(exerciseId);

  const { data: quizFeedbacks } = useGetQuizFeedbackQuery(exerciseId);

  const [deleteQuiz] = useDeleteQuizMutation();
  const [deleteQuizQuestion] = useDeleteQuizQuestionMutation();
  const [deleteQuizRelation] = useDeleteQuizRelationMutation();
  const [deleteQuizFeedback] = useDeleteQuizFeedbackMutation();
  const [deleteRating] = useDeleteRatingMutation();
  const [createRating] = useCreateRatingMutation();
  const {
    data: ratingData,
    refetch: refreshRating,
    isLoading: ratingLoading,
  } = useGetRatingByRateableIdQuery(exerciseId);

  useEffect(() => {
    refreshRating();
  }, [refreshRating]);

  useEffect(() => {
    refreshScore();
  }, [refreshScore]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const topMenu = [
    {
      onClick: () => navigate("/"),
      href: null,
      title: <HomeOutlined />,
    },
    {
      onClick: () => navigate("/exercises"),
      href: null,
      title: "Exercícios",
    },
    {
      onClick: () => {
        dispatch(setMenuTab(normalizeSubject(quiz?.subject)));
        navigate("/exercises");
      },
      href: null,
      title: normalizeSubject(quiz?.subject),
    },
    {
      href: null,
      title: quiz?.id,
    },
  ];

  const { confirm } = Modal;

  let content;

  if (isLoading) {
    content = (
      <Spin
        tip="Buscando questionário..."
        size="large"
        className="rounded-[10px] bg-white bg-opacity-100"
      >
        <div className="w-full h-24 mt-11 " />
      </Spin>
    );
  } else if (error) {
    content = (
      <>
        <p>Algo deu errado... recarregue está página.</p>
        <code>{error.data.message}</code>
      </>
    );
  } else if (quiz) {
    const subject = subjects.find(
      (item) => item.text === normalizeSubject(quiz.subject),
    );

    const dateCreate = new Date(quiz.createdAt);
    const createDataFormatted = formatDistanceToNow(dateCreate, {
      locale: ptBR,
    });
    const dateUpdate = new Date(quiz.updatedAt);
    const updatedDataFormatted = formatDistanceToNow(dateUpdate, {
      locale: ptBR,
    });

    let rating;
    if (ratingLoading) {
      rating = <Spin />;
    } else if (ratingData) {
      rating = ratingData?.find((rating) => rating.userId === userState?.id);
    }

    let score;
    if (scoreLoading) {
      score = <Spin />;
    } else if (quizScore) {
      score = quizScore.score;
    }

    const handleDeleteQuiz = async (quiz) => {
      try {
        await deleteQuizRelation(quiz.id);

        await Promise.all(
          quiz.Question.map((question) =>
            deleteQuizQuestion({
              quizId: quiz.id,
              quizQuestionId: question.id,
            }),
          ),
        );

        await Promise.all(
          quizFeedbacks.map((feedback) =>
            deleteQuizFeedback({ feedbackId: feedback.id }),
          ),
        );

        await deleteQuiz(quiz.id);

        notification.success({
          message: "Questionário deletado com sucesso!",
          description:
            "O questionário e as questões associadas a ele foram apagadas.",
        });

        navigate("/exercises");
        refetch();
      } catch (e) {
        notification.error({
          message: "Erro ao deletar questionário",
          description:
            "Ocorreu um erro ao tentar deletar o questionário. Por favor, tente novamente.",
        });
        console.log(e);
      }
    };

    const showConfirm = () => {
      confirm({
        title: "Você tem certeza?",
        icon: <ExclamationCircleFilled />,
        content:
          "Uma vez que deletar o questionário, não poderá recuperá-lo e todos os dados serão apagados.",
        okText: "Deletar",
        okType: "danger",
        cancelText: "Voltar",
        width: 600,
        onOk: () => handleDeleteQuiz(quiz),
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

          navigate("/exercises/create");
        },
      },
      {
        key: "delete",
        label: "Deletar",
        danger: true,
        onClick: showConfirm,
      },
    ];

    const handleLike = () => {
      setProcessingLike(true);
      console.log(rating);

      if (rating) {
        deleteRating({ id: rating.id, userId: userState.id }).then(() => {
          refreshRating();
          setProcessingLike(false);
        });
      } else {
        createRating({
          rateableId: exerciseId,
          rateableType: "QUIZ",
        }).then(() => {
          refreshRating();
          setProcessingLike(false);
        });
      }
    };

    content = (
      <>
        <Breadcrumb items={topMenu} />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className="m-0">{quiz.title}</h1>
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

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {subject.icon}
              <p>
                {subject.text} - {quiz.Question.length}{" "}
                {quiz.Question.length <= 1 ? "questão" : "questões"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Rate disabled defaultValue={score} allowHalf />
              <p className="text-[#EABF28]">
                {score === 0
                  ? "N.A."
                  : score <= 1
                    ? "Muito Fácil"
                    : score <= 2
                      ? "Fácil"
                      : score <= 3
                        ? "Médio"
                        : score <= 4
                          ? "Difícil"
                          : "Muito Difícil"}
              </p>
            </div>
          </div>

          <p>{quiz.description}</p>

          <div className="flex">
            <div className="flex gap-[10px] ">
              <Avatar
                shape="circle"
                size={55}
                src={
                  quiz.user.avatar ? API_AVATAR + quiz.user.avatar : undefined
                }
                icon={
                  quiz.user.avatar ? undefined : (
                    <UserRound size={40} strokeWidth={1.5} />
                  )
                }
              />
              <div className="flex flex-col justify-between ">
                <p className="text-xl">{quiz.user.name}</p>
                <UserLeague leagueSize="small" userId={quiz.user.id} />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-[10px] items-end w-full">
              <p className="text-sm opacity-60">
                Questionário criado: {createDataFormatted} atrás
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
              disabled={userState?.id === quiz.userId}
              className="flex gap-[5px] items-start p-0"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-red-200 rounded-full">
                <AlertOctagon size={16} />
              </div>
              <p>Reportar esse questionário</p>
            </Button>
            <div className="flex gap-[5px] items-center">
              {userState && userState.id !== quiz.userId && (
                <Button
                  type="link"
                  className="flex gap-[5px] items-start p-0"
                  onClick={handleLike}
                  disabled={processingLike}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-secondary bg-opacity-30 rounded-[10px]">
                    {rating ? (
                      <ThumbsUp
                        size={24}
                        color="#FFF"
                        fill="rgba(63, 81, 181)"
                      />
                    ) : (
                      <ThumbsUp
                        size={24}
                        color="#FFF"
                        fill="rgba(255, 64, 129, 0.30)"
                      />
                    )}
                  </div>
                </Button>
              )}

              {ratingLoading ? (
                <Spin />
              ) : ratingData.length > 1 ? (
                <span>{ratingData.length} Curtidas</span>
              ) : (
                <span>{ratingData.length} Curtida</span>
              )}
            </div>
          </div>
        </div>
        <Button
          type="primary"
          className="w-full mt-2 h-10 font-medium text-lg"
          onClick={() => {
            dispatch(clearQuizPractice());
            navigate("practice");
          }}
        >
          Começar questionário
        </Button>
      </>
    );
  }

  return <LayoutComponent quizName={quiz?.title}>{content}</LayoutComponent>;
};

export default ExerciseLanding;
