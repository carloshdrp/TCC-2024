import ConfettiExplosion from "react-confetti-explosion";
import { useDispatch, useSelector } from "react-redux";
import { getQuizId } from "../../redux/slices/quizPracticeSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetQuizFeedbackByIdQuery } from "../../api/slices/quizFeedbackApiSlice.js";
import LayoutComponent from "../../pages/layout/LayoutComponent.jsx";
import { useGetQuizQuestionAnswersQuery } from "../../api/slices/quizQuestionAnswersApiSlice.js";
import { Breadcrumb, Collapse, notification, Spin } from "antd";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HomeOutlined } from "@ant-design/icons";
import { setMenuTab } from "../../redux/slices/quizMenuSlice.js";
import { selectCurrentUser } from "../../redux/slices/authSlice.js";
import { ExternalLink } from "lucide-react";

const ExerciseResult = () => {
  const confettiConfig = {
    force: 0.6,
    duration: 3000,
    delay: 1000,
    particleCount: 150,
    floorHeight: 1600,
    floorWidth: 1600,
    colors: ["#3f51b5", "#ff4081"],
  };

  const userState = useSelector(selectCurrentUser);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { attemptId } = useParams();

  const {
    data: attemptData,
    isLoading: attemptLoading,
    error: attemptError,
  } = useGetQuizFeedbackByIdQuery(attemptId);

  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetQuizQuestionAnswersQuery({ attemptId });

  console.log(attemptData);

  useEffect(() => {
    if (attemptData) {
      if (userState.id !== attemptData.userId) {
        navigate("/exercises");
        notification.error({
          message: "Acesso negado",
          description: "Você não pode acessar os resultados de outros usuários",
        });
      }
    }
  }, [attemptData]);

  useEffect(() => {
    if (!attemptLoading) {
      setLoading(false);
    }
  }, [attemptLoading]);

  const quizIdState = useSelector(getQuizId);

  let content;
  if (loading) {
    content = <p>Carregando...</p>;
  } else if (attemptError) {
    content = (
      <>
        <p>Erro ao carregar o resultado 🫤</p>
        <code>{attemptError.data.message}</code>
      </>
    );
  } else if (attemptData) {
    let difficulty;
    switch (attemptData.score) {
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

    const date = new Date(attemptData.createdAt);
    const formattedDate = formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR,
    });

    const topMenu = [
      {
        onClick: () => navigate("/"),
        href: null,
        title: <HomeOutlined />,
      },
      {
        onClick: () => {
          dispatch(setMenuTab("Descobrir"));
          navigate("/exercises");
        },
        href: null,
        title: "Exercícios",
      },
      {
        onClick: () => {
          navigate("/exercises");
        },
        href: null,
        title: "Seu histórico",
      },
      {
        href: null,
        title: attemptData.id,
      },
    ];

    content = (
      <>
        <Breadcrumb items={topMenu} />

        <div className="flex justify-between items-center">
          <h1 className="m-0">
            Resultados do quiz:{" "}
            <span
              className="hover:underline hover:cursor-pointer relative"
              onClick={() => navigate(`/exercise/${attemptData.quiz.id}`)}
            >
              {attemptData.quiz.title}
              <ExternalLink size="12" className="top-1 ml-1 absolute" />
            </span>
          </h1>
          <p>{formattedDate}</p>
        </div>
        {questionsLoading ? (
          <Spin
            tip="Buscando respostas..."
            size="large"
            className="rounded-[10px] bg-white bg-opacity-100"
          >
            <div className="w-full h-24 mt-2 " />
          </Spin>
        ) : questionsError ? (
          <>
            <p>Não foi possível carregar suas respostas 🫤</p>
          </>
        ) : questionsData ? (
          <>
            <header className="mb-4 text-lg">
              <p>
                <b>Sua avaliação:</b> {difficulty}
              </p>
              <p className="mt-0.5">
                <b>Respostas certas:</b>{" "}
                {
                  questionsData.filter(
                    (question) => question.choice === "correct",
                  ).length
                }
                /{questionsData.length}
              </p>
            </header>

            <Collapse style={{ background: "none", border: "none" }}>
              {questionsData.map((answer) => {
                const userAnswer = answer.quizQuestion[answer.choice];
                const correctAnswer = answer.quizQuestion.correct;

                return (
                  <Collapse.Panel
                    key={answer.id}
                    header={answer.quizQuestion.description}
                    style={{
                      border: "solid 2px",
                      marginBottom: "10px",
                      borderRadius: "10px",
                      padding: "2px",
                      borderColor:
                        answer.choice === "correct" ? "green" : "red",
                    }}
                  >
                    <p>
                      <b>Sua resposta:</b> {userAnswer}
                    </p>
                    {answer.choice !== "correct" && (
                      <p>
                        <b>Resposta correta:</b> {correctAnswer}
                      </p>
                    )}
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </>
        ) : null}

        {quizIdState && <ConfettiExplosion {...confettiConfig} />}
      </>
    );
  }

  return <LayoutComponent>{content}</LayoutComponent>;
};

export default ExerciseResult;
