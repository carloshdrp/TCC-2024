import { Button, Card, Collapse, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getEditing,
  getQuestion,
  getQuiz,
  setEditing,
  setStep,
} from "../redux/slices/quizCreateSlice";
import { Pencil } from "lucide-react";
import { normalizeSubject } from "../utils/normalizeSubject";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateQuizMutation,
  useUpdateQuizMutation,
} from "../api/slices/quizApiSlice";
import {
  useCreateQuizQuestionMutation,
  useDeleteQuizQuestionMutation,
  useUpdateQuizQuestionMutation,
} from "../api/slices/quizQuestionApiSlice";
import { useCreateQuizRelationMutation } from "../api/slices/quizRelationApiSlice";
import { useHandleCancel } from "../utils/quiz/handleCancel.js";

const { Panel } = Collapse;

const QuizReview = () => {
  const quiz = useSelector(getQuiz);
  let materia = normalizeSubject(quiz.subject);
  const question = useSelector(getQuestion);
  const editing = useSelector(getEditing);
  const dispatch = useDispatch();

  const [createQuiz, { data: quizData }] = useCreateQuizMutation();
  const [updateQuiz, { data: quizDataUpdated }] = useUpdateQuizMutation();

  const [createQuizQuestion] = useCreateQuizQuestionMutation();
  const [updateQuizQuestion] = useUpdateQuizQuestionMutation();
  const [deleteQuizQuestion] = useDeleteQuizQuestionMutation();
  const [createQuizRelation] = useCreateQuizRelationMutation();

  const navigate = useNavigate();
  const handleCancel = useHandleCancel();

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (quizData) {
      setProcessing(true);
      const createQuestionsAndRelation = async () => {
        try {
          const quizId = quizData.id;
          await Promise.all(
            question.map((item) =>
              createQuizQuestion({ question: item, quizId }),
            ),
          );
          createQuizRelation({ quizId: quizData.id });

          notification.success({
            message: "Questionário publicado com sucesso!",
            description: "Você será redirecionado para a página de exercícios.",
          });
        } catch (error) {
          throw new Error(error.message);
        } finally {
          handleCancel();
          setProcessing(false);
        }
      };
      createQuestionsAndRelation();
    }
  }, [quizData]);

  useEffect(() => {
    if (quizDataUpdated && editing) {
      setProcessing(true);
      const updateQuestions = async () => {
        try {
          // Separa as questões que precisam ser atualizadas das que precisam ser criadas
          const questionsToUpdate = question.filter(
            (item) => item.id && item.quizId,
          );
          const questionsToCreate = question.filter(
            (item) => !item.id || !item.quizId,
          );
          const questionsToDelete = question.filter((item) => item.deleted);

          // Atualiza as questões existentes
          await Promise.all(
            questionsToUpdate.map((item) => {
              const { quizId, id, ...question } = item;
              return updateQuizQuestion({
                question,
                quizId,
                quizQuestionId: id,
              });
            }),
          );

          // Cria novas questões
          await Promise.all(
            questionsToCreate.map((item) => {
              return createQuizQuestion({
                question: item,
                quizId: quizDataUpdated.id,
              });
            }),
          );

          await Promise.all(
            questionsToDelete.map((item) => {
              return deleteQuizQuestion({
                quizId: item.quizId,
                quizQuestionId: item.id,
              });
            }),
          );

          notification.success({
            message: "Questionário atualizado com sucesso!",
            description: "Você será redirecionado para a página de exercícios.",
          });
        } catch (e) {
          console.error(e);
          notification.error({
            message: "Erro ao atualizar o questionário",
            description: e.message,
          });
        } finally {
          setEditing(false);
          handleCancel();
          setProcessing(false);
        }
      };

      updateQuestions();
    }
  }, [quizDataUpdated, editing]); // Removido as dependências desnecessárias

  const handlePublish = async () => {
    setProcessing(true);
    try {
      if (editing) {
        const chavesEditaveis = ["title", "description", "subject"];

        const quizParaEditar = chavesEditaveis.reduce((obj, chave) => {
          if (Object.prototype.hasOwnProperty.call(quiz, chave)) {
            obj[chave] = quiz[chave];
          }
          return obj;
        }, {});

        await updateQuiz({ id: quiz.id, quiz: quizParaEditar });
      } else {
        await createQuiz(quiz);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <>
      <Card
        title="Dados do questionário"
        className="mb-4"
        extra={
          <Button type="text" onClick={() => dispatch(setStep(0))}>
            <Pencil size={20} color="#333" />
          </Button>
        }
      >
        <p>
          <strong>Título:</strong> {quiz.title}
        </p>
        <p>
          <strong>Descrição:</strong> {quiz.description}
        </p>
        <p>
          <strong>Matéria:</strong> {materia}
        </p>
      </Card>
      <Card
        title={
          "Dados das questões ( Total: " +
          question.filter((item) => !item.deleted).length +
          ")"
        }
        className="mb-4"
        extra={
          <Button type="text" onClick={() => dispatch(setStep(1))}>
            <Pencil size={20} color="#333" />
          </Button>
        }
      >
        <Collapse accordion ghost>
          {question
            .filter((item) => !item.deleted)
            .map((item, index) => (
              <Panel header={`Questão ${index + 1}`} key={index}>
                <p>
                  <strong>Enunciado:</strong> {item.description}
                </p>
                <p>
                  <strong>Resposta certa:</strong>
                  <ul>
                    <li> {item.correct}</li>
                  </ul>
                </p>
                <p>
                  <strong>Outras alternativas:</strong>
                  <ul>
                    <li>{item.wrong1}</li>
                    <li>{item.wrong2}</li>
                    <li>{item.wrong3}</li>
                    <li>{item.wrong4}</li>
                  </ul>
                </p>
              </Panel>
            ))}
        </Collapse>
      </Card>
      <Button
        type="primary"
        className="w-full font-medium"
        onClick={handlePublish}
        isLoading={processing}
      >
        {editing ? "Atualizar questionário" : "Publicar questionário"}
      </Button>
      <Button danger onClick={handleCancel} className="w-full mt-2">
        Cancelar
      </Button>
    </>
  );
};

export default QuizReview;
