import { useGetForumQuestionsQuery } from "../../api/slices/forumApiSlice.js";
import { Spin } from "antd";
import CountUp from "react-countup";
import { useGetAnswersQuery } from "../../api/slices/answersApiSlice.js";
import { useGetRatingByUserIdQuery } from "../../api/slices/ratingApiSlice.js";

const ProfileForumActivities = ({ userId }) => {
  const filter = {
    userId,
  };

  const {
    data: questionsData,
    error: questionError,
    isLoading: questionLoading,
  } = useGetForumQuestionsQuery(filter);

  const { data: answersData, isLoading: answerLoading } =
    useGetAnswersQuery(filter);

  const { data: ratingData, isLoading: ratingLoading } =
    useGetRatingByUserIdQuery(userId);

  let content;

  if (questionLoading || answerLoading || ratingLoading) {
    content = (
      <Spin tip="Carregando dados..." className="bg-white rounded-lg">
        <div className="h-20 " />
      </Spin>
    );
  } else if (questionError) {
    content = <p>Ocorreu um erro ao carregar as questões</p>;
  } else {
    const filteredRatingData = ratingData.filter(
      (rating) =>
        rating.rateableType === "ANSWER" || rating.rateableType === "QUESTION",
    );

    content = (
      <div className="grid grid-flow-col p-2 text-center bg-white rounded-md">
        <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10 flex flex-col justify-between gap-3">
          <h3 className="m-0">
            {questionsData.length === 1 ? "Pergunta" : "Perguntas"}
          </h3>
          <CountUp
            end={questionsData.length}
            duration="2"
            className="text-3xl font-medium text-text"
          />
        </div>
        <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10 flex flex-col justify-between">
          <h3 className="m-0">
            {answersData.length === 1 ? "Resposta" : "Respostas"}
          </h3>
          <CountUp
            end={answersData.length}
            duration="2"
            className="text-3xl font-medium text-text"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="m-0">Curtidas fornecidas</h3>
          <CountUp
            end={filteredRatingData.length}
            duration="2"
            className="text-3xl font-medium text-text"
          />
        </div>
      </div>
    );
  }

  return content;
};

export default ProfileForumActivities;
