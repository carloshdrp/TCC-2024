import { Button, Result } from "antd";
import { Angry, Annoyed, Frown, Laugh, Smile } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearQuizPractice,
  getCurrentStep,
  setCurrentStep,
  setScore,
} from "../../redux/slices/quizPraticeSlice.js";
import { useNavigate } from "react-router-dom";

const ExerciseFeedback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStep = useSelector(getCurrentStep);

  const handleCancel = () => {
    dispatch(clearQuizPractice());
    navigate("/exercises");
  };

  const handleNext = () => {
    dispatch(setCurrentStep(currentStep + 1));
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
                onClick={() => {
                  dispatch(setScore(5));
                }}
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
                onClick={() => {
                  dispatch(setScore(4));
                }}
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
                onClick={() => {
                  dispatch(setScore(3));
                }}
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
                onClick={() => {
                  dispatch(setScore(2));
                }}
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
                onClick={() => {
                  dispatch(setScore(1));
                }}
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
