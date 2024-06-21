import { MessageSquareText, Users } from "lucide-react";
import { useGetForumQuestionsQuery } from "../../api/slices/forumApiSlice.js";
import { Spin } from "antd";
import { useGetCountQuery } from "../../api/slices/profileApiSlice.js";

export const ForumStatisticWidgets = () => {
  const {
    data: questionsData,
    error: questionError,
    isLoading: questionLoading,
  } = useGetForumQuestionsQuery();

  const { data: usersData, isLoading: usersLoading } = useGetCountQuery();

  let content;
  if (questionLoading || usersLoading) {
    content = (
      <Spin
        tip="Buscando perguntas..."
        size="large"
        className="rounded-[10px] bg-white bg-opacity-100"
      >
        <div className="w-full h-24 mt-11 " />
      </Spin>
    );
  } else if (questionError) {
    content = <p>Erro: {questionError}</p>;
  } else if (questionsData && usersData) {
    let questionCount = questionsData ? questionsData.length : 0;

    content = (
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
            <p>{questionCount}</p>
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
            <p>{usersData.count}</p>
          </div>
        </div>
      </div>
    );
  }

  return content;
};
