import { useGetForumQuestionsQuery } from "../../api/slices/forumApiSlice.js";
import { Spin } from "antd";

const ProfileForumActivities = ({ userId }) => {
  const filter = {
    userId,
  };

  const {
    data: questionsData,
    error: questionError,
    isLoading: questionLoading,
  } = useGetForumQuestionsQuery(filter);

  let content;

  if (questionLoading) {
    content = (
      <Spin tip="Carregando dados...">
        <div className="grid h-20 grid-flow-col p-2 text-center bg-white rounded-lg shadow-md" />
      </Spin>
    );
  } else if (questionError) {
    content = <p>Ocorreu um erro ao carregar as questões</p>;
  } else {
    content = (
      <div className="grid grid-flow-col p-2 text-center bg-white rounded-lg shadow-md">
        <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
          <h3 className="m-0">Questões Abertas</h3>
          <p className="text-4xl font-black"> {questionsData.length}</p>
        </div>
        <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
          <h3 className="m-0">Questões Respondidas</h3>
          <p className="text-4xl font-black"> 0</p>
        </div>
        <div>
          <h3 className="m-0">Avaliações</h3>
          <p className="text-4xl font-black"> 0</p>
        </div>
      </div>
    );
  }

  return content;
};

export default ProfileForumActivities;
