import { Spin } from "antd";
import CountUp from "react-countup";
import { useGetRatingByUserIdQuery } from "../../api/slices/ratingApiSlice.js";
import { useGetQuizzesQuery } from "../../api/slices/quizApiSlice.js";
import { useGetQuizzesFeedbacksQuery } from "../../api/slices/quizFeedbackApiSlice.js";
import { useEffect } from "react";

const ProfileForumActivities = ({ userId }) => {
  const filter = {
    userId,
  };

  const {
    data: quizzesData,
    error: quizzesError,
    isLoading: quizzesLoading,
    refetch: quizzesRefetch,
  } = useGetQuizzesQuery(filter);

  const {
    data: answersData,
    isLoading: answerLoading,
    refetch: answersRefetch,
  } = useGetQuizzesFeedbacksQuery(filter);

  const {
    data: ratingData,
    isLoading: ratingLoading,
    refetch: ratingRefetch,
  } = useGetRatingByUserIdQuery(userId);

  useEffect(() => {
    quizzesRefetch();
    answersRefetch();
    ratingRefetch();
  }, [quizzesRefetch, answersRefetch, ratingRefetch]);

  let content;

  if (quizzesLoading || answerLoading || ratingLoading) {
    content = (
      <Spin tip="Carregando dados..." className="bg-white rounded-lg">
        <div className="h-20 " />
      </Spin>
    );
  } else if (quizzesError) {
    content = <p>Ocorreu um erro ao carregar as questões</p>;
  } else {
    const filteredRatingData = ratingData.filter(
      (rating) => rating.rateableType === "QUIZ",
    );

    content = (
      <div className="grid grid-flow-col p-2 text-center bg-white rounded-md">
        <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10 flex flex-col justify-between gap-3">
          <h3 className="m-0">
            {quizzesData.length === 1 ? "Quiz criado" : "Quizzes criados"}
          </h3>
          <CountUp
            end={quizzesData.length}
            duration="2"
            className="text-3xl font-medium text-text"
          />
        </div>
        <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10 flex flex-col justify-between">
          <h3 className="m-0">
            {answersData.length === 1 ? "Quiz realizado" : "Quizzes realizados"}
          </h3>
          <CountUp
            end={answersData.length}
            duration="2"
            className="text-3xl font-medium text-text"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="m-0">
            {" "}
            {filteredRatingData.length === 1 ? "Curtida" : "Curtidas"}
          </h3>
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
