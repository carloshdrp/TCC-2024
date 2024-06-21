import {
  useDeleteForumQuestionMutation,
  useGetForumQuestionQuery,
} from "../../api/slices/forumApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button, notification, Result, Spin } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import LayoutComponent from "../../pages/layout/LayoutComponent";

const DeleteConfirm = () => {
  const { questionId } = useParams();
  const userState = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const [deleteForumQuestion] = useDeleteForumQuestionMutation(questionId);

  const questionData = useGetForumQuestionQuery(questionId);

  useEffect(() => {
    if (questionData.data && questionData.data.Answer.length > 0) {
      notification.error({
        message: "Erro ao deletar pergunta",
        description:
          "Não é possível deletar uma pergunta que já possui respostas",
      });
      return navigate(`/forum/${questionId}`);
    }
    if (questionData.data && questionData.data.userId !== userState.id) {
      notification.error({
        message: "Erro ao deletar pergunta",
        description: "Você não pode deletar uma pergunta que não é sua.",
      });
      return navigate("/forum");
    }
  }, [questionData.data, navigate, userState.id, questionId]);

  const handleDelete = async () => {
    try {
      await deleteForumQuestion(questionId);
      notification.success({
        message: "Pergunta deletada com sucesso!",
        description: "Você foi reembolsado com +1 ponto.",
      });
      navigate("/forum");
    } catch (error) {
      console.log(error);

      notification.error({
        message: "Erro ao deletar pergunta",
        description: "Não foi possível deletar a pergunta. Tente novamente.",
      });
    }
  };

  let content;

  if (questionData.loading) {
    content = <Spin fullscreen />;
  } else if (questionData.data) {
    content = (
      <LayoutComponent>
        <Result
          status="warning"
          title="Você tem certeza?"
          subTitle="Todos os dados serão deletados e não poderão ser recuperados. Você vai receber os pontos gastos de volta."
          extra={[
            <Button
              type="primary"
              key="back"
              className="w-1/5 "
              onClick={() => navigate(`/forum/${questionId}`)}
            >
              Voltar
            </Button>,
            <Button danger key="confirm" onClick={handleDelete}>
              Confirmar
            </Button>,
          ]}
        />
      </LayoutComponent>
    );
  }

  return content;
};

export default DeleteConfirm;
