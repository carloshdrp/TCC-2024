import { Button, notification, Result } from "antd";
import { Angry, Annoyed, Frown, Laugh, Smile } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearQuizPractice,
  getCurrentStep,
  getQuizId,
  getQuizQuestions,
  setScore,
} from "../../redux/slices/quizPracticeSlice.js";
import { useNavigate } from "react-router-dom";
import { useCreateQuizFeedbackMutation } from "../../api/slices/quizFeedbackApiSlice.js";
import { useCreateQuizQuestionAnswerMutation } from "../../api/slices/quizQuestionAnswersApiSlice.js";
import { useEffect, useState } from "react";

const ExerciseFeedback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quizId = useSelector(getQuizId);
  const quizQuestions = useSelector(getQuizQuestions);
  const currentStep = useSelector(getCurrentStep);

  const [score, setScoreState] = useState(0);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (shouldNavigate) {
      handleNext();
      setShouldNavigate(false);
    }
  }, [score]);

  const [createQuizFeedback, { data: feedbackData }] =
    useCreateQuizFeedbackMutation();
  const [createQuizQuestionAnswer] = useCreateQuizQuestionAnswerMutation();

  useEffect(() => {
    if (feedbackData) {
      const createQuizQuestionAnswerF = async () => {
        try {
          Object.values(quizQuestions).forEach((question) => {
            createQuizQuestionAnswer({
              choice: question.choice,
              quizQuestionId: question.quizQuestionId,
              quizAttemptId: feedbackData.id,
            });
          });
        } catch (e) {
          console.error(e);
        }
      };
      createQuizQuestionAnswerF().then(() => {
        notification.success({
          title: "Respostas salvas",
          message: "Suas respostas foram salvas com sucesso!",
          description: "Você ganhou 1 ponto por completar o questionário!",
        });
      });
    }
  }, [feedbackData]);

  const handleCancel = () => {
    dispatch(clearQuizPractice());
    navigate("/exercises");
  };

  const handleNext = () => {
    handlePublish().then((quizAttempt) => {
      navigate(`/exercises/result/${quizAttempt.data.id}`);
      dispatch(clearQuizPractice());
    });
  };

  const handleScoreChange = (newScore) => {
    setScoreState(newScore);
    setShouldNavigate(true);
  };

  const handlePublish = async () => {
    try {
      console.log("scoreState:", score);
      if (score === 0) setScoreState(undefined);
      dispatch(setScore(score));
      // score não está sendo passado corretamente!
      return await createQuizFeedback({ quizId, score });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Result
      status="success"
      icon={false}
      className="text-text font-medium"
      title="Questionário finalizado com sucesso!"
      subTitle="Você ainda pode sair do questionário sem salvar suas respostas."
      extra={
        <>
          <p className="mb-2 text-lg font-normal">
            Classifique a sua experiência com o questionário para acessar seu
            resultado.
          </p>
          <p className="font-normal opacity-70">
            (Clique em uma das alternativas abaixo)
          </p>
          <div className="my-10 flex  items-center justify-center gap-4 survey font-normal">
            <div>
              <Button
                type="primary"
                className="bg-red-500"
                shape="circle"
                style={{
                  width: "64px",
                  height: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<Angry size={40} />}
                onClick={() => handleScoreChange(5)}
              />
              <p>Muito Difícil</p>
            </div>
            <div>
              <Button
                type="primary"
                className="bg-orange-500"
                shape="circle"
                style={{
                  width: "64px",
                  height: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<Frown size={40} />}
                onClick={() => handleScoreChange(4)}
              />
              <p>Difícil</p>
            </div>
            <div>
              <Button
                type="primary"
                className="bg-yellow-500"
                shape="circle"
                style={{
                  width: "64px",
                  height: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<Annoyed size={40} />}
                onClick={() => handleScoreChange(3)}
              />
              <p>Médio</p>
            </div>
            <div>
              <Button
                type="primary"
                className="bg-green-500"
                shape="circle"
                style={{
                  width: "64px",
                  height: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<Smile size={40} />}
                onClick={() => handleScoreChange(2)}
              />
              <p>Fácil</p>
            </div>
            <div>
              <Button
                type="primary"
                className="bg-emerald-500"
                shape="circle"
                style={{
                  width: "64px",
                  height: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<Laugh size={40} />}
                onClick={() => handleScoreChange(1)}
              />
              <p>Muito Fácil</p>
            </div>
          </div>

          <Button type="link" danger onClick={handleCancel} key="console">
            Sair sem salvar
          </Button>
          <Button key="buy" onClick={handleNext}>
            Prefiro não responder
          </Button>
        </>
      }
    />
  );
};

export default ExerciseFeedback;
