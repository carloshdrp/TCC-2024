import LayoutComponent from "./layout/LayoutComponent.jsx";
import { Steps } from "antd";
import QuizCreate from "../components/QuizCreate.jsx";
import QuizQuestionCreate from "../components/QuizQuestionCreate.jsx";
import QuizReview from "../components/QuizReview.jsx";
import { getStep } from "../redux/slices/quizCreateSlice.js";
import { useSelector } from "react-redux";

const steps = [
  {
    title: "Questionário",
    description: "Configure o questionário",
    content: <QuizCreate />,
  },
  {
    title: "Questões",
    description: "Configure as questões",
    content: <QuizQuestionCreate />,
  },
  {
    title: "Publicar",
    description: "Revise as informações",
    content: <QuizReview />,
  },
];

const ExerciseCreate = () => {
  const items = steps.map((item) => ({
    title: item.title,
    content: item.content,
    key: item.title,
    description: item.description,
  }));

  const step = useSelector(getStep);

  return (
    <LayoutComponent>
      <Steps items={items} current={step} className="mb-[20px]" />
      <div>{steps[step].content}</div>
    </LayoutComponent>
  );
};

export default ExerciseCreate;
