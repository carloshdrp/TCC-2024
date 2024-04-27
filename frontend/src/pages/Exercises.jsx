import LayoutComponent from "./layout/LayoutComponent.jsx";
import ExercisesMenu from "../components/Quiz/ExercisesMenu.jsx";
import { Button } from "antd";
import QuizArticles from "../components/Quiz/QuizArticles.jsx";
import { useSelector } from "react-redux";
import { getMenuTab } from "../redux/slices/quizMenuSlice.js";

function Exercises() {
  const menuTab = useSelector(getMenuTab);

  return (
    <LayoutComponent>
      <div className="grid grid-cols-12 gap-3 text-text">
        <ExercisesMenu />

        <div className="col-span-9 bg-white rounded-[10px] p-[10px] px-[20px] gap-[10px]">
          <h1 className="p-0 m-0 font-extrabold">{menuTab}</h1>
          <div className="flex gap-[10px]">
            <div className="flex flex-col bg-[url('./assets/bg-discovery-card-1.png')] bg-center bg-repeat-round w-full p-[20px] text-white rounded-[10px]">
              <h2 className="m-0 text-[26px] font-medium">
                Questionário aleatório
              </h2>
              <p className="mb-[50px]">Ideal para uma revisão geral</p>
              <Button type="primary">Começar</Button>
            </div>

            <div className="flex flex-col bg-[url('./assets/bg-discovery-card-2.png')] bg-center bg-repeat-round w-full p-[20px] text-white rounded-[10px]">
              <h2 className="m-0 text-[26px] font-medium">
                Questionário aleatório
              </h2>
              <p className="mb-[50px]">Ideal para uma revisão geral</p>
              <Button
                type="primary"
                className="bg-secondary hover:!bg-[#FF63A6]"
              >
                Fórum
              </Button>
            </div>
          </div>

          <QuizArticles />
        </div>
      </div>
    </LayoutComponent>
  );
}

export default Exercises;
