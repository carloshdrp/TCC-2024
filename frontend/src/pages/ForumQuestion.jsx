import { useParams } from "react-router-dom";
import { Breadcrumb, Spin, Avatar, Button, Dropdown, notification } from "antd";
import { HomeOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LayoutComponent from "./layout/LayoutComponent";
import { useGetForumQuestionQuery } from "../api/slices/forumApiSlice";
import { AlertOctagon, ThumbsUp, UserRound } from "lucide-react";
import { API_AVATAR } from "../config";
import UserLeague from "../components/UserLeague";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useDeleteRatingMutation,
  useCreateRatingMutation,
  useGetRatingByRateableIdQuery,
} from "../api/slices/ratingApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";
import QuestionAnswers from "../components/QuestionAnswers";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input } from "antd";
import {
  useCreateAnswerMutation,
  useGetAnswersByQuestionIdQuery,
} from "../api/slices/answersApiSlice";

export const ForumQuestion = () => {
  const { questionId } = useParams();
  const userState = useSelector(selectCurrentUser);
  const [form] = Form.useForm();

  const [isExpanded, setIsExpanded] = useState(false);
  const [processingLike, setProcessingLike] = useState(false);
  const [refreshAnswers, setRefreshAnswers] = useState(0);

  const {
    data: questionData,
    error: questionError,
    isLoading: questionLoading,
    refetch,
  } = useGetForumQuestionQuery(questionId);

  useEffect(() => {
    refetch();
  }, [questionData, refetch, refreshAnswers]);

  const ratingData = useGetRatingByRateableIdQuery(questionId);

  const [createAnswer, { isLoading }] = useCreateAnswerMutation();
  const { data: answerData, isLoading: answerLoading } =
    useGetAnswersByQuestionIdQuery(questionId);

  const [deleteRating] = useDeleteRatingMutation();
  const [createRating] = useCreateRatingMutation();

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await createAnswer({
        questionId,
        description: values.description,
      });
      form.resetFields();
      setRefreshAnswers((i) => i + 1);
      setIsExpanded(false);
      notification.success({
        message: "Resposta adicionada com sucesso!",
      });
    } catch (error) {
      notification.error({
        message: "Erro ao adicionar resposta!",
        description: error.error,
      });
    }
  };

  let content;
  if (questionLoading || answerLoading) {
    content = <Spin fullscreen />;
  } else if (questionError) {
    content = <p>Erro: {questionError}</p>;
  } else if (questionData && answerData) {
    const dateCreate = new Date(questionData.createdAt);
    const createDataFormatted = formatDistanceToNow(dateCreate, {
      locale: ptBR,
    });
    const dateUpdate = new Date(questionData.updatedAt);
    const updatedDataFormatted = formatDistanceToNow(dateUpdate, {
      locale: ptBR,
    });

    const topMenu = [
      {
        onClick: () => navigate("/"),
        href: null,
        title: <HomeOutlined />,
      },
      {
        onClick: () => navigate("/forum"),
        href: null,
        title: "Fórum",
      },
      {
        onClick: () => navigate("/forum"),
        href: null,
        title: questionData.tag.name,
      },
      {
        href: null,
        title: questionData.id,
      },
    ];

    const rating = ratingData?.data.find(
      (rating) => rating.userId === userState?.id,
    );

    const handleLike = () => {
      setProcessingLike(true);

      if (rating) {
        deleteRating({ id: rating.id, userId: userState.id }).then(() => {
          ratingData.refetch();
          setProcessingLike(false);
        });
      } else {
        createRating({
          rateableId: questionId,
          rateableType: "QUESTION",
        }).then(() => {
          ratingData.refetch();
          setProcessingLike(false);
        });
      }
    };

    const settings = [
      {
        key: "edit",
        label: "Editar",
        onClick: () => navigate(`edit`),
      },
      {
        key: "delete",
        label: "Deletar",
        danger: true,
        onClick: () => navigate(`delete`),
      },
    ];

    const toggleExpansion = () => {
      setIsExpanded(!isExpanded);
    };

    content = (
      <LayoutComponent questionName={questionData.title}>
        <div className="flex flex-col gap-[20px]">
          <Breadcrumb items={topMenu} />

          <div
            key={questionData.id}
            className="bg-white text-text p-[10px] rounded-[10px] flex flex-col gap-[10px]"
          >
            <div className="flex justify-between">
              <h1 className="m-0 text-2xl font-medium">{questionData.title}</h1>
              {userState && questionData.userId === userState.id && (
                <Dropdown
                  menu={{
                    items: settings,
                  }}
                  trigger={["click"]}
                  className="cursor-pointer"
                >
                  <EllipsisOutlined className="px-2 text-xl rounded-md text-text hover:bg-background " />
                </Dropdown>
              )}
            </div>
            <p className="px-[10px] bg-background rounded-[10px] w-fit">
              {questionData.tag.name}
            </p>

            <p>{questionData.description}</p>

            <div className="flex">
              <div className="flex gap-[10px] ">
                <Avatar
                  shape="circle"
                  size={55}
                  src={
                    questionData.user.avatar
                      ? API_AVATAR + questionData.user.avatar
                      : undefined
                  }
                  icon={
                    questionData.user.avatar ? undefined : (
                      <UserRound size={40} strokeWidth={1.5} />
                    )
                  }
                />
                <div className="flex flex-col justify-between ">
                  <p className="text-xl">{questionData.user.name}</p>
                  <UserLeague
                    leagueSize="small"
                    userId={questionData.user.id}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between gap-[10px] items-end w-full">
                <p className="text-sm opacity-60">
                  Pergunta criada: {createDataFormatted} atrás
                </p>
                <p className="text-sm opacity-60">
                  Última modificação: {updatedDataFormatted} atrás
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                type="link"
                danger
                disabled={userState?.id === questionData.userId}
                className="flex gap-[5px] items-start p-0"
              >
                <div className="flex items-center justify-center w-6 h-6 bg-red-200 rounded-full">
                  <AlertOctagon size={16} />
                </div>
                <p>Reportar essa pergunta</p>
              </Button>
              <div className="flex gap-[5px] items-center">
                {userState && userState.id !== questionData.userId && (
                  <Button
                    type="link"
                    className="flex gap-[5px] items-start p-0"
                    onClick={handleLike}
                    disabled={processingLike}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-secondary bg-opacity-30 rounded-[10px]">
                      {rating ? (
                        <ThumbsUp
                          size={24}
                          color="#FFF"
                          fill="rgba(63, 81, 181)"
                        />
                      ) : (
                        <ThumbsUp
                          size={24}
                          color="#FFF"
                          fill="rgba(255, 64, 129, 0.30)"
                        />
                      )}
                    </div>
                  </Button>
                )}

                {ratingData.isLoading ? (
                  <Spin />
                ) : ratingData.data.length > 1 ? (
                  <span>{ratingData.data.length} Curtidas</span>
                ) : (
                  <span>{ratingData.data.length} Curtida</span>
                )}
              </div>
            </div>
          </div>
          {answerData?.length > 1 ? (
            <p>{answerData.length} Respostas</p>
          ) : (
            <p>{answerData.length} Resposta</p>
          )}
          <span className="bg-text w-full h-[2px] bg-opacity-10 rounded-full" />

          {userState &&
            userState?.id !== questionData.userId &&
            !answerData.some((answer) => answer.userId === userState?.id) && (
              <div className="flex flex-col">
                <Button type="primary" onClick={toggleExpansion}>
                  Responder essa pergunta
                </Button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        originY: 0,
                        overflow: "hidden",
                        marginTop: 10,
                      }} // Isso faz com que a animação comece do topo
                    >
                      <Form
                        form={form}
                        name="perguntar"
                        initialValues={{ remember: true }}
                        layout="vertical"
                        className="text-left rounded-[10px]"
                        onFinish={onFinish}
                      >
                        <Form.Item
                          name="description"
                          hasFeedback="true"
                          rules={[
                            {
                              required: true,
                              message: "Este é um campo obrigatório!",
                            },
                            {
                              min: 20,
                              message:
                                "A resposta deve ter no mínimo 20 caracteres!",
                            },
                          ]}
                        >
                          <Input.TextArea
                            placeholder="Digite uma resposta detalhada"
                            className="bg-white"
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            className="w-full "
                            loading={isLoading}
                            htmlType="submit"
                          >
                            Enviar resposta
                          </Button>
                        </Form.Item>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          <QuestionAnswers
            questionId={questionData.id}
            refreshAnswers={refreshAnswers}
          />
        </div>
      </LayoutComponent>
    );
  }

  return content;
};
