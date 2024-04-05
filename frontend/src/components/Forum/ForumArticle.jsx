import { Avatar, Button } from "antd";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ForumArticle = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-white rounded-t-[10px] flex flex-col gap-[10px] text-text p-[10px]">
        <p
          className="text-2xl font-medium truncate hover:whitespace-normal"
          id="title"
        >
          Como que são formadas as moléculas de água dentro de um corpo x com
          determinado x coisa aleatoria ocupe o espaço logo.
        </p>

        <div className="flex flex-row gap-1 ">
          <span className="px-3 py-0.5 rounded-xl bg-neutral-400">
            Ciências da Natureza
          </span>
          <span>#química</span>
        </div>
        <div className="flex items-end justify-between text-text">
          <div className="flex gap-2">
            <Avatar
              shape="circle"
              size={42}
              icon={<UserRound size={32} color="#333" strokeWidth={1.5} />}
            />
            <div className="flex flex-col">
              <p className="font-medium">John Doe</p>
              <span className="text-sm text-opacity-60">30 minutos atrás</span>
            </div>
          </div>

          <div>
            <div className="flex gap-2">
              <span>0 respostas</span>
              <span>0 avaliações</span>
            </div>
          </div>
        </div>
      </div>
      <Button
        type="primary"
        className="w-full rounded-t-none"
        onClick={() => navigate("66544asfa47as")}
      >
        Ler mais
      </Button>
    </div>
  );
};
