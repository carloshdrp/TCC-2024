import { subjects } from "../../utils/quizSubjects.jsx";
import { Avatar, Rate, Spin } from "antd";
import { Dot, UserRound } from "lucide-react";
import { useGetQuizzesQuery } from "../../api/slices/quizApiSlice.js";
import { normalizeSubject } from "../../utils/normalizeSubject.js";
import { useEffect } from "react";

const QuizArticles = () => {
  const {
    data: quizzesData,
    error: quizzesError,
    isLoading: quizzesLoading,
    refetch,
  } = useGetQuizzesQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  let content;
  if (quizzesLoading) {
    content = (
      <Spin
        tip="Buscando perguntas..."
        size="large"
        className="rounded-[10px] bg-white bg-opacity-100"
      >
        <div className="w-full h-24 mt-11 " />
      </Spin>
    );
  } else if (quizzesError) {
    content = <p>Erro: {quizzesError.message}</p>;
  } else if (quizzesData) {
    if (quizzesData.length > 0) {
      content = quizzesData.map((quiz) => {
        const subject = subjects.find(
          (item) => item.text === normalizeSubject(quiz.subject),
        );

        return (
          <article
            key={quiz.id}
            className="flex flex-col gap-[5px] px-[10px] py-[5px] text-text my-[5px] cursor-pointer"
            onClick={() => {
              console.log("oi");
            }}
          >
            <h2 className=" font-medium text-[20px] m-0">Título</h2>
            <div className="flex justify-between">
              <div className="flex gap-[5px]">
                {subject.icon}
                <p>{subject.text}</p>
              </div>
              <div className="flex items-center gap-1">
                <Rate disabled defaultValue={1.5} allowHalf />
                <p className="text-[#EABF28]">Fácil</p>
              </div>
            </div>
            <p>Descrição do questionário vai vir aqui</p>
            <span className="bg-text w-full h-[1px] bg-opacity-20 rounded-full" />
            <footer>
              <div className="flex justify-between text-sm items-center">
                <div className="flex gap-[2px] items-center">
                  <Avatar
                    shape="circle"
                    size={24}
                    icon={<UserRound size={20} strokeWidth={1.5} />}
                  />
                  <p>John Doe</p>
                  <Dot opacity="50%" />
                  <p>há 2 minutos</p>
                </div>
                <p>0 Curtida</p>
              </div>
            </footer>
          </article>
        );
      });
    }

    return content;
  }
};

export default QuizArticles;
