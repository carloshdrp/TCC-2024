import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Drawer, Input, notification, Spin, Table } from "antd";
import { Check, EyeIcon, UserRound, XIcon } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { API_AVATAR } from "../../config/index.js";
import {
  useGetReportsQuery,
  useUpdateReportStatusMutation,
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
import renderStatusBadge from "./RenderStatusBadge.jsx";

const Reports = () => {
  const {
    data: reports,
    isLoading,
    refetch,
  } = useGetReportsQuery({ sortBy: "desc" });
  const [updateReportStatus] = useUpdateReportStatusMutation();
  const [deleteQuestion] = useDeleteForumQuestionMutation();
  const [deleteAnswer] = useDeleteAnswerMutation();
  const [deleteQuiz] = useDeleteQuizMutation();
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { data: question, isLoading: isQuestionLoading } =
    useGetForumQuestionQuery(selectedResourceId, {
      skip:
        selectedResourceType !== "QUESTION" ||
        reports?.find((r) => r.id === selectedReport)?.status === "ACCEPTED",
    });

  const { data: answer, isLoading: isAnswerLoading } = useGetAnswerQuery(
    selectedResourceId,
    {
      skip:
        selectedResourceType !== "ANSWER" ||
        reports?.find((r) => r.id === selectedReport)?.status === "ACCEPTED",
    },
  );

  const { data: quiz, isLoading: isQuizLoading } = useGetQuizQuery(
    selectedResourceId,
    {
      skip:
        selectedResourceType !== "QUIZ" ||
        reports?.find((r) => r.id === selectedReport)?.status === "ACCEPTED",
    },
  );

  const { data: quizQuestions, isLoading: isQuizQuestionsLoading } =
    useGetQuizQuestionsQuery(
      { quizId: selectedResourceId },
      { skip: selectedResourceType !== "QUIZ" },
    );

  const columnFilters = useMemo(
    () => ({
      reason: [
        { text: "Spam", value: "SPAM" },
        { text: "Conteúdo inapropriado", value: "INAPROPRIADO" },
        { text: "Conteúdo ofensivo", value: "OFENSIVO" },
        { text: "Divulgação", value: "LINKS" },
        { text: "Outro", value: "OUTRO" },
      ],
      reportableType: [
        { text: "Pergunta", value: "QUESTION" },
        { text: "Resposta", value: "ANSWER" },
        { text: "Quiz", value: "QUIZ" },
      ],
      status: [
        { text: "Pendente", value: "PENDING" },
        { text: "Aceita", value: "ACCEPTED" },
        { text: "Rejeitada", value: "REJECTED" },
      ],
    }),
    [],
  );

  const columns = [
    {
      title: "Motivo",
      dataIndex: "reason",
      key: "reason",
      filters: columnFilters.reason,
      onFilter: (value, record) => record.reason === value,
      render: (reason) =>
        columnFilters.reason.find((filter) => filter.value === reason)?.text,
    },
    {
      title: "Tipo",
      dataIndex: "reportableType",
      key: "reportableType",
      filters: columnFilters.reportableType,
      onFilter: (value, record) => record.reportableType === value,
      render: (reportableType) =>
        columnFilters.reportableType.find(
          (filter) => filter.value === reportableType,
        )?.text,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: columnFilters.status,
      onFilter: (value, record) => record.status === value,
      render: (status) => renderStatusBadge(status, columnFilters.status),
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
            icon={<EyeIcon size={16} />}
            onClick={() =>
              handleViewResource(
                report.reportableType,
                report.reportableId,
                report.id,
              )
            }
          >
            Visualizar
          </Button>
        </>
      ),
    },
  ];

  const handleViewResource = (reportableType, reportableId, reportId) => {
    setSelectedResourceType(reportableType);
    setSelectedResourceId(reportableId);
    setSelectedReport(reportId);
    setVisibleDrawer(true);
  };

  const handleUpdateReportStatus = async (reportId, status) => {
    const updateData = {
      reportId,
      status,
      message: feedbackMessage.trim().length > 0 ? feedbackMessage : undefined,
    };

    setIsActionLoading(true);
    try {
      await updateReportStatus(updateData);
      notification.success({
        message: "Status da denúncia atualizado com sucesso!",
        description: "O usuário poderá acessar o retorno.",
      });
      refetch();
      setVisibleDrawer(false);
      setFeedbackMessage("");
    } catch (e) {
      notification.error({
        message: "Erro ao atualizar o status da denúncia!",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteHandlers = {
    QUESTION: deleteQuestion,
    ANSWER: deleteAnswer,
    QUIZ: deleteQuiz,
  };

  const handleDeleteResource = async (reportableType, reportableId) => {
    const deleteHandler = deleteHandlers[reportableType];
    if (deleteHandler) {
      try {
        await updateReportStatus({
          reportId: selectedReport,
          status: "ACCEPTED",
        });
        await deleteHandler(reportableId);
        refetch();
        setVisibleDrawer(false);
      } catch (e) {
        notification.error({
          message: `Erro ao deletar ${reportableType.toLowerCase()}!`,
        });
      }
    }
  };

  const resourceComponents = {
    QUESTION: () => (
      <>
        {question ? (
          <>
            <div className="flex">
              <Avatar
                src={
                  question.user?.avatar
                    ? API_AVATAR + question.user.avatar
                    : null
                }
                className="mr-1"
                icon={
                  question.user?.avatar ? null : (
                    <UserRound size={20} strokeWidth={1.5} />
                  )
                }
              />
              <h3 className="m-0">
                {question.user?.name || "Usuário desconhecido"}
              </h3>
            </div>

            <p>Permissão: {question.user?.role || "N/A"}</p>
            <p>Email: {question.user?.email || "N/A"}</p>

            <h2 className="m-0 mt-2">Pergunta:</h2>
            <p>
              <b>Título:</b> {question.title}
            </p>
            <p>
              <b>Conteúdo:</b> {question.description || "Sem descrição"}
            </p>
          </>
        ) : (
          <p>Pergunta não encontrada ou foi deletada.</p>
        )}
      </>
    ),
    ANSWER: () => (
      <>
        {answer ? (
          <>
            <div className="flex">
              <Avatar
                src={
                  answer.user?.avatar ? API_AVATAR + answer.user.avatar : null
                }
                className="mr-1"
                icon={
                  answer.user?.avatar ? null : (
                    <UserRound size={20} strokeWidth={1.5} />
                  )
                }
              />
              <h3 className="m-0">
                {answer.user?.name || "Usuário desconhecido"}
              </h3>
            </div>
            <p>Permissão: {answer.user?.role || "N/A"}</p>
            <p>Email: {answer.user?.email || "N/A"}</p>
            <h2 className="m-0 my-1">Resposta:</h2>
            <p>{answer.description || "Sem descrição"}</p>
          </>
        ) : (
          <p>Resposta não encontrada ou foi deletada.</p>
        )}
      </>
    ),
    QUIZ: () => (
      <>
        {quiz ? (
          <>
            <div className="flex">
              <Avatar
                src={quiz.user?.avatar ? API_AVATAR + quiz.user.avatar : null}
                className="mr-1"
                icon={
                  quiz.user?.avatar ? null : (
                    <UserRound size={20} strokeWidth={1.5} />
                  )
                }
              />
              <h3 className="m-0">
                {quiz.user?.name || "Usuário desconhecido"}
              </h3>
            </div>
            <p>Permissão: {quiz.user?.role || "N/A"}</p>
            <p>Email: {quiz.user?.email || "N/A"}</p>

            <h2 className="m-0 mt-2">Descrição do questionário:</h2>
            <p>{quiz.description || "Sem descrição"}</p>
            {quizQuestions && quizQuestions.length > 0 ? (
              quizQuestions.map((question, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <h3 className="m-0 mt-2">Questão {index + 1}</h3>
                  <p>{question.description || "Sem descrição"}</p>
                  <p className="bg-green-200 px-2 rounded">
                    {question.correct || "N/A"}
                  </p>
                  <p className="bg-red-200 px-2 rounded">
                    {question.wrong1 || "N/A"}
                  </p>
                  <p className="bg-red-200 px-2 rounded">
                    {question.wrong2 || "N/A"}
                  </p>
                  <p className="bg-red-200 px-2 rounded">
                    {question.wrong3 || "N/A"}
                  </p>
                  <p className="bg-red-200 px-2 rounded">
                    {question.wrong4 || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p>Nenhuma questão encontrada para este quiz.</p>
            )}
          </>
        ) : (
          <p>Quiz não encontrado ou foi deletado.</p>
        )}
      </>
    ),
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={reports}
        loading={isLoading}
        rowKey="id"
      />
      <Drawer
        title="Detalhes da Denúncia"
        placement="right"
        onClose={() => setVisibleDrawer(false)}
        open={visibleDrawer}
        width={500}
      >
        {isQuestionLoading ||
        isAnswerLoading ||
        isQuizLoading ||
        isQuizQuestionsLoading ? (
          <Spin />
        ) : (
          <>
            {selectedReport &&
              reports &&
              reports?.find((r) => r.id === selectedReport)?.status !==
                "ACCEPTED" && (
                <>
                  {resourceComponents[selectedResourceType] &&
                    resourceComponents[selectedResourceType]()}
                </>
              )}
            {reports?.find((r) => r.id === selectedReport)?.status ===
              "ACCEPTED" && <p className="line-through">Recurso removido</p>}
            <h2 className="m-0 my-1">Informações da denúncia</h2>
            <p>
              <p>
                <strong>Motivo:</strong>{" "}
                {selectedReport &&
                  reports &&
                  columnFilters.reason.find(
                    (filter) =>
                      filter.value ===
                      reports.find((r) => r.id === selectedReport)?.reason,
                  )?.text}
              </p>
              <p>
                <strong>Descrição:</strong>{" "}
                {selectedReport &&
                  reports &&
                  (reports.find((r) => r.id === selectedReport)?.description ||
                    "Não fornecida")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedReport &&
                  reports &&
                  columnFilters.status.find(
                    (filter) =>
                      filter.value ===
                      reports.find((r) => r.id === selectedReport)?.status,
                  )?.text}
              </p>
              <p>
                <strong>Retorno ao denunciante:</strong>{" "}
                {selectedReport &&
                  reports &&
                  reports.find((r) => r.id === selectedReport)?.status !==
                    "PENDING" &&
                  (reports.find((r) => r.id === selectedReport)?.message ||
                    "Não fornecido")}
              </p>
            </p>

            {selectedReport &&
              reports &&
              reports?.find((r) => r.id === selectedReport)?.status ===
                "PENDING" && (
                <>
                  <Input.TextArea
                    rows={4}
                    placeholder="Escreva aqui (opcional)"
                    rootClassName="mt-2"
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                  />
                  <div className="flex w-full items-center justify-between mt-2 gap-2">
                    <Button
                      className="flex gap-2 items-center w-full"
                      onClick={() =>
                        handleDeleteResource(
                          selectedResourceType,
                          selectedResourceId,
                        )
                      }
                      loading={isActionLoading}
                      icon={<Check size={16} />}
                      danger
                      type="primary"
                    >
                      Aceitar
                    </Button>
                    <Button
                      className="flex gap-2 items-center w-full"
                      onClick={() =>
                        handleUpdateReportStatus(selectedReport, "REJECTED")
                      }
                      icon={<XIcon size={16} />}
                    >
                      Rejeitar
                    </Button>
                  </div>
                </>
              )}
          </>
        )}
      </Drawer>
    </>
  );
};

export default Reports;
