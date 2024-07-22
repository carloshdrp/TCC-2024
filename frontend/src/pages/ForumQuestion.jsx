import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Dropdown,
  Form,
  Input,
  notification,
  Spin,
} from "antd";
import { EllipsisOutlined, HomeOutlined } from "@ant-design/icons";
import LayoutComponent from "./layout/LayoutComponent";
import { useGetForumQuestionQuery } from "../api/slices/forumApiSlice";
import { ThumbsUp, UserRound } from "lucide-react";
import { API_AVATAR } from "../config";
import UserLeague from "../components/UserLeague";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useGetRatingByRateableIdQuery,
} from "../api/slices/ratingApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";
import QuestionAnswers from "../components/QuestionAnswers";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCreateAnswerMutation,
  useGetAnswersByQuestionIdQuery,
} from "../api/slices/answersApiSlice";
import ReportButton from "../components/Report/ReportButton.jsx";
import coin from "../assets/coin.png";

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

  const {
    data: ratingData,
    isLoading: ratingLoading,
    refetch: refetchRating,
  } = useGetRatingByRateableIdQuery(questionId);

  useEffect(() => {
    refetchRating();
  }, [refetchRating]);

  const [createAnswer, { isLoading }] = useCreateAnswerMutation();
  const { data: answerData, isLoading: answerLoading } =
    useGetAnswersByQuestionIdQuery(questionId);

  const [deleteRating] = useDeleteRatingMutation();
  const [createRating] = useCreateRatingMutation();

  const navigate = useNavigate();

  const onFinish = async (values) => {
    await createAnswer({
      questionId,
      description: values.description,
    }).then((res) => {
      if (!res.error?.data) {
        notification.success({
          message: "Resposta adicionada com sucesso!",
          description: "Foi adicionado 1 ponto à sua conta!",
        });
      } else {
        notification.error({
          message: "Erro ao adicionar resposta!",
          description: res.error.data.message,
        });
      }
    });
    form.resetFields();
    setRefreshAnswers((i) => i + 1);
    setIsExpanded(false);
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
        title: questionData.tag,
      },
      {
        href: null,
        title: questionData.title,
      },
    ];

    const rating = ratingData?.find(
      (rating) => rating.userId === userState?.id,
    );

    const handleLike = () => {
      setProcessingLike(true);

      if (rating) {
        deleteRating({ id: rating.id, userId: userState.id }).then(() => {
          refetchRating();
          setProcessingLike(false);
        });
      } else {
        createRating({
          rateableId: questionId,
          rateableType: "QUESTION",
        }).then(() => {
          refetchRating();
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
              <ReportButton
                type="QUESTION"
                resourceId={questionData.id}
                userId={userState?.id}
                resourceOnwerId={questionData.userId}
              />

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

                {ratingLoading ? (
                  <Spin />
                ) : ratingData.length > 1 ? (
                  <span>{ratingData.length} Curtidas</span>
                ) : (
                  <span>{ratingData.length} Curtida</span>
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
            !answerData.some((answer) => answer.userId === userState?.id) &&
            userState?.role !== "INICIANTE" && (
              <div className="flex flex-col">
                <Badge.Ribbon
                  text={
                    <p>
                      +1 <img src={coin} alt="coin" className="w-3 h-3" />
                    </p>
                  }
                  className="-mt-1 text-sm"
                  color="gold"
                >
                  <Button
                    type="primary"
                    onClick={toggleExpansion}
                    className="w-full h-9"
                  >
                    Responder essa pergunta
                  </Button>
                </Badge.Ribbon>

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
                            showCount
                            placeholder="Digite uma resposta detalhada"
                            className="bg-white"
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            className="w-full mt-4"
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
