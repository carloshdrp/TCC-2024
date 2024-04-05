import { Link } from "react-router-dom";
import { Progress } from "antd";

export const ForumAchievements = () => {
  return (
    <div className="bg-white w-full h-fit p-[10px] rounded-[10px] flex flex-col gap-[10px]">
      <div className="flex items-center justify-between text-text">
        <p className="text-3xl font-medium mb-[10px]">Conquistas</p>
        <Link to="/profile" className="text-text">
          Ver todas
        </Link>
      </div>

      <div className="flex gap-2 h-fit">
        <div className="w-[70px] rounded-[5px] bg-gray-400" />
        <div className="flex flex-col">
          <p className="text-xl font-medium"> Gênio matemático</p>
          <p>Responda 10 perguntas de matemática</p>
          <Progress
            percent={90}
            status="active"
            strokeColor={{
              from: "rgba(63, 81, 181, 0.6)",
              to: "rgba(63, 81, 181, 1)",
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 h-fit">
        <div className="w-[70px] rounded-[5px] bg-gray-400" />
        <div className="flex flex-col">
          <p className="text-xl font-medium"> Gênio matemático</p>
          <p>Responda 10 perguntas de matemática</p>
          <Progress
            percent={80}
            status="active"
            strokeColor={{
              from: "rgba(63, 81, 181, 0.6)",
              to: "rgba(63, 81, 181, 1)",
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 h-fit">
        <div className="w-[70px] rounded-[5px] bg-gray-400" />
        <div className="flex flex-col">
          <p className="text-xl font-medium"> Gênio matemático</p>
          <p>Responda 10 perguntas de matemática</p>
          <Progress
            percent={70}
            status="active"
            strokeColor={{
              from: "rgba(63, 81, 181, 0.6)",
              to: "rgba(63, 81, 181, 1)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
