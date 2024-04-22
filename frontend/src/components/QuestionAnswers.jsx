import { useGetAnswersByQuestionIdQuery } from "../api/slices/answersApiSlice";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Spin,
  Dropdown,
  Avatar,
  Button,
  Form,
  Input,
  notification,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { UserRound, ThumbsUp, AlertOctagon } from "lucide-react";
import UserLeague from "./UserLeague";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { API_AVATAR } from "../config";
import { motion } from "framer-motion";
import {
  useUpdateAnswerMutation,
  useDeleteAnswerMutation,
} from "../api/slices/answersApiSlice";
import {
  useDeleteRatingMutation,
  useCreateRatingMutation,
  useGetRatingByRateableTypeQuery,
} from "../api/slices/ratingApiSlice";
import PropTypes from "prop-types";

const QuestionAnswers = ({ questionId, refreshAnswers }) => {
  const userState = useSelector(selectCurrentUser);
  const [deleteRating] = useDeleteRatingMutation();
  const [createRating] = useCreateRatingMutation();
  const {
    data: ratingData,
    isLoading: ratingLoading,
    refetch: ratingRefetch,
  } = useGetRatingByRateableTypeQuery("ANSWER");

  const {
    data: answers,
    error,
    isLoading,
    refetch,
  } = useGetAnswersByQuestionIdQuery(questionId);

  const [updateAnswer, { data: updateAnswerResponse }] =
    useUpdateAnswerMutation();
  const [deleteAnswer, { data: deleteAnswerResponse }] =
    useDeleteAnswerMutation();

  useEffect(() => {
    refetch();
  }, [
    questionId,
    refetch,
    refreshAnswers,
    updateAnswerResponse,
    deleteAnswerResponse,
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [processingLike, setProcessingLike] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);

  const [form] = Form.useForm();

  if (isLoading)
    return (
      <Spin
        tip="Buscando respostas..."
        size="large"
        className="rounded-[10px] bg-white bg-opacity-100"
      >
        <div className="w-full h-24 mt-11 " />
      </Spin>
    );
  if (error) return <div>Error: {error.message}</div>;

  const handleEditButton = (id, description) => {
    form.setFieldsValue({ description: description });

    setIsEditing(true);
    setEditingAnswerId(id);
  };

  return (
    <>
      {answers &&
        answers.map((answer) => {
          const settings = [
            {
              key: "edit",
              label: "Editar",
              onClick: () => handleEditButton(answer.id, answer.description),
            },
            {
              key: "delete",
              label: "Deletar",
              danger: true,
              onClick: () => {
                deleteAnswer(answer.id).then(() => {
                  notification.success({
                    message: "Resposta deletada com sucesso!",
                  });
                });
              },
            },
          ];

          const dateCreate = new Date(answer.createdAt);
          const createDataFormatted = formatDistanceToNow(dateCreate, {
            locale: ptBR,
          });
          const dateUpdate = new Date(answer.updatedAt);
          const updatedDataFormatted = formatDistanceToNow(dateUpdate, {
            locale: ptBR,
          });

          const rating = ratingData?.find(
            (rating) =>
              rating.userId === userState?.id && rating.rateableId === answer.id
          );

          const handleLike = () => {
            setProcessingLike(true);
            if (rating) {
              deleteRating({ id: rating.id, userId: userState.id }).then(() => {
                ratingRefetch();
                setProcessingLike(false);
              });
            } else {
              createRating({
                rateableId: answer.id,
                rateableType: "ANSWER",
              }).then(() => {
                ratingRefetch();
                setProcessingLike(false);
              });
            }
          };

          const onFinish = async (values) => {
            try {
              await updateAnswer({
                id: answer.id,
                answer: values,
              });
              form.resetFields();
              setIsEditing(false);
              notification.success({
                message: "Resposta editada com sucesso!",
              });
            } catch (error) {
              notification.error({
                message: "Erro ao editar resposta!",
                description: error.error,
              });
            }
          };

          let ratingCount;
          if (ratingLoading) {
            ratingCount = <Spin />;
          } else if (ratingData) {
            ratingCount = ratingData.filter(
              (rating) => rating.rateableId === answer.id
            ).length;
          }

          return (
            <div
              key={answer.id}
              className="bg-white text-text p-[10px] rounded-[10px] flex flex-col gap-[10px]"
            >
              <div className="flex justify-between">
                <div className="flex gap-[10px] w-full">
                  <Avatar
                    shape="circle"
                    size={55}
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
                  <div className="flex flex-col justify-between">
                    <div className="flex gap-2 h-fit ">
                      <p className="text-xl">{answer.user.name}</p>
                      <UserLeague leagueSize="small" userId={answer.user.id} />
                    </div>
                    {answer.updatedAt !== answer.createdAt ? (
                      <p className="text-sm opacity-60">
                        Editado {updatedDataFormatted} atrás
                      </p>
                    ) : (
                      <p className="text-sm opacity-60">
                        Respondido {createDataFormatted} atrás
                      </p>
                    )}
                  </div>
                </div>
                {userState && answer.userId === userState.id && (
                  <Dropdown
                    menu={{
                      items: settings,
                    }}
                    trigger={["click"]}
                    className="cursor-pointer h-9"
                  >
                    <EllipsisOutlined className="px-2 text-xl rounded-md text-text hover:bg-background " />
                  </Dropdown>
                )}
              </div>

              {isEditing && editingAnswerId === answer.id ? (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ originY: 0, overflow: "hidden", marginTop: 10 }} // Isso faz com que a animação comece do topo
                >
                  <Form
                    form={form}
                    name="perguntar"
                    variant="filled"
                    initialValues={{
                      remember: true,
                      description: answer.description,
                    }}
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
                      <Input.TextArea placeholder="Digite uma resposta detalhada" />
                    </Form.Item>
                    <Form.Item>
                      <div className="flex gap-2">
                        <Button onClick={() => setIsEditing(false)}>
                          Cancelar edição
                        </Button>
                        <Button
                          className="w-full "
                          loading={isLoading}
                          htmlType="submit"
                          type="primary"
                        >
                          Salvar resposta
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </motion.div>
              ) : (
                <p>{answer.description}</p>
              )}

              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex justify-between">
                  <Button
                    type="link"
                    danger
                    disabled={userState?.id === answer.userId}
                    className="flex gap-[5px] items-start p-0"
                  >
                    <div className="flex items-center justify-center w-6 h-6 bg-red-200 rounded-full">
                      <AlertOctagon size={16} />
                    </div>
                    <p>Reportar essa resposta</p>
                  </Button>
                </div>
                <div className="flex flex-col justify-end gap-[10px] items-end w-full">
                  <div className="flex gap-[5px] items-center">
                    {userState && userState.id !== answer.userId && (
                      <Button
                        type="link"
                        className="flex gap-[5px] items-center p-0"
                        disabled={processingLike}
                        onClick={handleLike}
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
                    ) : ratingCount > 1 ? (
                      <span>{ratingCount} Curtidas</span>
                    ) : (
                      <span>{ratingCount} Curtida</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

QuestionAnswers.propTypes = {
  questionId: PropTypes.string.isRequired,
  refreshAnswers: PropTypes.number.isRequired,
};

export default QuestionAnswers;
