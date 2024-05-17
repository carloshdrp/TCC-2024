import { useNavigate, useParams } from "react-router-dom";
import { useGetQuizQuestionsQuery } from "../api/slices/quizQuestionApiSlice.js";
import { Button, Modal, Progress, Radio, Space, Spin } from "antd";
import LayoutComponent from "./layout/LayoutComponent.jsx";
import { useEffect, useState } from "react";
import shuffleAnswers from "../utils/quiz/shuffleAnswers.js";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateQuizQuestion,
  clearQuizPractice,
  getCurrentStep,
  getQuizQuestions,
  setCurrentStep,
  setQuizId,
} from "../redux/slices/quizPraticeSlice.js";
import ExerciseFeedback from "../components/Quiz/ExerciseFeedback.jsx";

const ExercisePractice = () => {
  const { exerciseId } = useParams();

  const { confirm } = Modal;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentStep = useSelector(getCurrentStep);

  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetQuizQuestionsQuery({
    quizId: exerciseId,
  });

  const quizQuestions = useSelector(getQuizQuestions);

  const quizLength = questionsData?.length;
  const [choice, setChoice] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    if (questionsData && currentStep <= quizLength) {
      const question = questionsData[currentStep - 1];
      setShuffledAnswers(shuffleAnswers(question));
    }
  }, [currentStep, questionsData]);

  let content;
  if (questionsLoading) {
    content = (
      <Spin
        tip="Buscando questionário..."
        size="large"
        className="rounded-[10px] bg-white bg-opacity-100"
      >
        <div className="w-full h-24 mt-11 " />
      </Spin>
    );
  } else if (questionsError) {
    content = (
      <>
        <p>Algo deu errado... recarregue está página.</p>
        <code>{questionsError.data.message}</code>
      </>
    );
  } else if (questionsData) {
    const question = questionsData[currentStep - 1];

    const quizProgress = (currentStep / quizLength) * 100;

    const showFinishConfirm = () => {
      confirm({
        title: "Você tem certeza?",
        icon: <ExclamationCircleFilled />,
        content: "Ao finalizar você não poderá mais alterar suas respostas.",
        okText: "Finalizar",
        okType: "primary",
        cancelText: "Cancelar",
        width: 600,
        onOk: () => handleNext(),
      });
    };

    const showConfirm = () => {
      confirm({
        title: "Você tem certeza?",
        icon: <ExclamationCircleFilled />,
        content: "Ao sair sem terminar seu progresso será perdido.",
        okText: "Sair",
        okType: "danger",
        cancelText: "Cancelar",
        width: 600,
        onOk: () => handleCancel(),
      });
    };

    const userChoice = quizQuestions[question?.id]?.text;

    const handleNext = () => {
      if (currentStep === quizLength) {
        dispatch(setQuizId(question.quiz.id));
      }

      dispatch(setCurrentStep(currentStep + 1));
    };

    const handleBack = () => {
      dispatch(setCurrentStep(currentStep - 1));
    };

    const handleCancel = () => {
      dispatch(clearQuizPractice());
      navigate("/exercises");
    };

    content = (
      <>
        {currentStep === quizLength + 1 ? (
          <ExerciseFeedback />
        ) : currentStep === quizLength + 2 ? (
          <h2>oi</h2>
        ) : (
          <>
            <Progress
              percent={quizProgress}
              status="active"
              strokeColor="#FF4081"
              format={() => `${currentStep}/${quizLength}`}
            />
            <h1 className="m-0">Questão {currentStep}</h1>
            <p className="text-lg mb-2">{question.description}</p>
            <Radio.Group
              value={userChoice}
              onChange={(e) => {
                const selectedAnswer = shuffledAnswers.find(
                  (answer) => answer.text === e.target.value,
                );
                const isCorrect = selectedAnswer.isCorrect;
                setChoice(isCorrect);
                dispatch(
                  addOrUpdateQuizQuestion({
                    quizQuestionId: question.id,
                    text: selectedAnswer.text,
                    choice: isCorrect,
                  }),
                );
              }}
            >
              <Space direction="vertical" className="mt-2">
                {shuffledAnswers.map((answer) => (
                  <Radio key={answer.isCorrect} value={answer.text}>
                    {answer.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <div className="flex gap-2 mt-2">
              {currentStep > 1 && (
                <Button className="w-1/4" onClick={handleBack}>
                  Voltar
                </Button>
              )}

              {currentStep < quizLength + 1 && (
                <Button
                  type="primary"
                  className="w-full"
                  onClick={
                    currentStep === quizLength ? showFinishConfirm : handleNext
                  }
                  disabled={choice === null}
                >
                  {currentStep === quizLength ? "Finalizar" : "Avançar"}
                </Button>
              )}
            </div>
            <Button type="link" danger onClick={showConfirm}>
              Sair do questionário
            </Button>
          </>
        )}
      </>
    );
  }

  return <LayoutComponent>{content}</LayoutComponent>;
};

export default ExercisePractice;
