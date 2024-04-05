import { MessageSquareText, Users } from "lucide-react";

export const ForumStatisticWidgets = () => {
  return (
    <div className="flex flex-col gap-1">
      <div className="bg-white rounded-[10px] p-[10px] flex gap-[10px] items-center">
        <div className="flex items-center justify-center w-12 h-12 bg-secondary bg-opacity-20 rounded-[10px]">
          <MessageSquareText
            size={28}
            opacity="70%"
            color="rgba(255, 64, 129, 1)"
            strokeWidth={2}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-medium text-text">Perguntas</p>
          <p>572</p>
        </div>
      </div>
      <div className="bg-white rounded-[10px] p-[10px] flex gap-[10px] items-center">
        <div className="flex items-center justify-center w-12 h-12 bg-secondary bg-opacity-20 rounded-[10px]">
          <Users
            size={28}
            opacity="70%"
            color="rgba(255, 64, 129, 1)"
            strokeWidth={2}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-medium text-text">Usuários</p>
          <p>27</p>
        </div>
      </div>
    </div>
  );
};
