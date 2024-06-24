import { Avatar, Button, Drawer, notification, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import {
  useDeleteReportMutation,
  useGetReportsQuery,
} from "../../api/slices/reportApiSlice";
import {
  useDeleteForumQuestionMutation,
  useGetForumQuestionQuery,
} from "../../api/slices/forumApiSlice";
import {
  useDeleteAnswerMutation,
  useGetAnswerQuery,
} from "../../api/slices/answersApiSlice";
import {
  useDeleteQuizMutation,
  useGetQuizQuery,
} from "../../api/slices/quizApiSlice";
import { useGetQuizQuestionsQuery } from "../../api/slices/quizQuestionApiSlice.js";
import { EyeIcon, TrashIcon, UserRound, XIcon } from "lucide-react";
import { API_AVATAR } from "../../config/index.js";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const { data: reports, isLoading, refetch } = useGetReportsQuery();
  const [deleteReport] = useDeleteReportMutation();
  const [deleteQuestion] = useDeleteForumQuestionMutation();
  const [deleteAnswer] = useDeleteAnswerMutation();
  const [deleteQuiz] = useDeleteQuizMutation();
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { data: question, isLoading: isQuestionLoading } =
    useGetForumQuestionQuery(selectedResourceId, {
      skip: selectedResourceType !== "QUESTION",
    });
  const { data: answer, isLoading: isAnswerLoading } = useGetAnswerQuery(
    selectedResourceId,
    {
      skip: selectedResourceType !== "ANSWER",
    },
  );
  const { data: quiz, isLoading: isQuizLoading } = useGetQuizQuery(
    selectedResourceId,
    {
      skip: selectedResourceType !== "QUIZ",
    },
  );

  const { data: quizQuestions, isLoading: isQuizQuestionsLoading } =
    useGetQuizQuestionsQuery(
      { quizId: selectedResourceId },
      {
        skip: selectedResourceType !== "QUIZ",
      },
    );

  const handleViewResource = (reportableType, reportableId, reportId) => {
    setSelectedResourceType(reportableType);
    setSelectedResourceId(reportableId);
    setSelectedReport(reportId);
    setVisibleDrawer(true);
  };

  const handleDeleteResource = async (reportableType, reportableId) => {
    if (reportableType === "QUESTION") {
      try {
        await deleteQuestion(reportableId);
        await deleteReport(selectedReport);

        notification.success({
          message: "Pergunta deletada com sucesso!",
          description: "A pergunta foi removida da plataforma.",
        });
      } catch (e) {
        notification.error({
          message: "Erro ao deletar pergunta!",
        });
      }
    } else if (reportableType === "ANSWER") {
      try {
        await deleteAnswer(reportableId);
        await deleteReport(selectedReport);

        notification.success({
          message: "Respostas deletada com sucesso!",
          description: "A resposta foi removida da plataforma.",
        });
      } catch (e) {
        notification.error({
          message: "Erro ao deletar pergunta!",
        });
      }
    } else if (reportableType === "QUIZ") {
      try {
        await deleteQuiz(reportableId);
        await deleteReport(selectedReport);

        notification.success({
          message: "Questionário deletado com sucesso!",
          description: "O questionário foi removido da plataforma.",
        });
      } catch (e) {
        notification.error({
          message: "Erro ao deletar questionário!",
        });
      }
    }
    refetch();
    setVisibleDrawer(false);
  };

  const handleDeleteReport = async (reportId) => {
    await deleteReport(reportId);
    refetch();
    setVisibleDrawer(false);
    notification.success({
      message: "Denúncia removida com sucesso!",
      description: "O recurso denúnciado não foi deletado.",
    });
  };

  const columns = [
    {
      title: "Motivo",
      dataIndex: "reason",
      key: "reason",
      filters: [
        { text: "Spam", value: "SPAM" },
        { text: "Conteúdo inapropriado", value: "INAPROPRIADO" },
        { text: "Conteúdo ofensivo", value: "OFENSIVO" },
        { text: "Divulgação", value: "LINKS" },
        { text: "Outro", value: "OUTRO" },
      ],
      onFilter: (value, record) => record.reason === value,
    },
    {
      title: "Tipo",
      dataIndex: "reportableType",
      key: "reportableType",
      filters: [
        { text: "Pergunta", value: "QUESTION" },
        { text: "Resposta", value: "ANSWER" },
        { text: "Quiz", value: "QUIZ" },
      ],
      onFilter: (value, record) => record.reportableType === value,
    },
    {
      title: "ID do recurso",
      dataIndex: "reportableId",
      key: "reportableId",
    },
    {
      title: "Denunciado por",
      dataIndex: ["reportedBy", "email"],
      key: "reportedBy",
    },
    {
      title: "Ação",
      key: "actions",
      render: (_, report) => (
        <>
          <Button
            className="flex items-center justify-center gap-2"
            onClick={() =>
              handleViewResource(
                report.reportableType,
                report.reportableId,
                report.id,
              )
            }
          >
            <EyeIcon />
            Analisar
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={reports} loading={isLoading} columns={columns} />
      <Drawer
        title="Analisar denúncia"
        placement="right"
        size="large"
        onClose={() => setVisibleDrawer(false)}
        open={visibleDrawer}
      >
        {selectedResourceType === "QUESTION" && (
          <Spin
            spinning={isQuestionLoading}
            tip="Carregando dados..."
            className="bg-white rounded-lg"
          >
            {question && (
              <div>
                <h2 className="m-0">
                  <Avatar
                    shape="circle"
                    size={32}
                    src={
                      question.user.avatar
                        ? API_AVATAR + question.user.avatar
                        : undefined
                    }
                    icon={
                      question.user.avatar ? undefined : (
                        <UserRound size={40} strokeWidth={1.5} />
                      )
                    }
                  />
                  {question.user.name}
                </h2>
                <div className="mb-2 opacity-80 text-sm">
                  <p>Permissão: {question.user.role}</p>
                  <p>Email: {question.user.email}</p>
                </div>
                <div className="w-full bg-black h-0.5 my-2 rounded-full opacity-15" />

                <h2 className="m-0">{question.title}</h2>
                <p>{question.description}</p>
              </div>
            )}
          </Spin>
        )}
        {selectedResourceType === "ANSWER" && (
          <Spin
            spinning={isAnswerLoading}
            tip="Carregando dados..."
            className="bg-white rounded-lg"
          >
            {answer && (
              <div>
                <h2 className="m-0">
                  <Avatar
                    shape="circle"
                    size={32}
                    src={
                      answer.user.avatar
                        ? API_AVATAR + answer.user.avatar
                        : undefined
                    }
                    icon={
                      answer.user.avatar ? undefined : (
                        <UserRound size={40} strokeWidth={1.5} />
                      )
                    }
                  />
                  {answer.user.name}
                </h2>
                <div className="mb-2 opacity-80 text-sm">
                  <p>Permissão: {answer.user.role}</p>
                  <p>Email: {answer.user.email}</p>
                </div>
                <div className="w-full bg-black h-0.5 my-2 rounded-full opacity-15" />

                <p className="mb-1 text-lg">{answer.description}</p>
                <Button
                  type="link"
                  className="p-0"
                  onClick={() => navigate("/forum/" + answer.question.id)}
                >
                  Acessar pergunta
                </Button>
              </div>
            )}
          </Spin>
        )}
        {selectedResourceType === "QUIZ" && (
          <Spin
            spinning={isQuizLoading || isQuizQuestionsLoading}
            tip="Carregando dados..."
            className="bg-white rounded-lg"
          >
            {quiz && (
              <div>
                <h2 className="m-0">
                  <Avatar
                    shape="circle"
                    size={32}
                    src={
                      quiz.user.avatar
                        ? API_AVATAR + quiz.user.avatar
                        : undefined
                    }
                    icon={
                      quiz.user.avatar ? undefined : (
                        <UserRound size={40} strokeWidth={1.5} />
                      )
                    }
                  />
                  {quiz.user.name}
                </h2>
                <div className="mb-2 opacity-80 text-sm">
                  <p>Permissão: {quiz.user.role}</p>
                  <p>Email: {quiz.user.email}</p>
                </div>
                <div className="w-full bg-black h-0.5 my-2 rounded-full opacity-15" />
                <h2 className="m-0">{quiz.title}</h2>
                <p>{quiz.description}</p>
                <div className="w-full bg-black h-0.5 my-2 rounded-full opacity-15" />
                {quizQuestions &&
                  quizQuestions.map((question) => (
                    <div key={question.id}>
                      <h4 className="m-0 mt-3 text-wrap">
                        {question.description}
                      </h4>
                      <ul className="m-0">
                        <li className="bg-green-200 px-1 rounded">
                          Resposta correta: {question.correct}
                        </li>
                        <li className="bg-red-200 px-1 rounded">
                          Incorreta 1: {question.wrong1}
                        </li>
                        <li className="bg-red-200 px-1 rounded">
                          Incorreta 2: {question.wrong2}
                        </li>
                        <li className="bg-red-200 px-1 rounded">
                          Incorreta 3: {question.wrong3}
                        </li>
                        <li className="bg-red-200 px-1 rounded">
                          Incorreta 4: {question.wrong4}
                        </li>
                      </ul>
                    </div>
                  ))}
              </div>
            )}
          </Spin>
        )}
        <div className="flex flex-col gap-2 mt-10">
          <Button
            type="primary"
            danger
            className="flex items-center justify-center gap-2"
            onClick={() =>
              handleDeleteResource(selectedResourceType, selectedResourceId)
            }
          >
            <TrashIcon />
            Deletar recurso
          </Button>
          <Button
            onClick={() => handleDeleteReport(selectedReport)}
            className="flex items-center justify-center gap-2"
            danger
          >
            <XIcon /> Remover denúncia
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Reports;
