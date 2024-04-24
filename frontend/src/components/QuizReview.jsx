import { Button, Card, Collapse, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getQuiz, getQuestion, setStep } from "../redux/slices/quizCreateSlice";
import { Pencil } from "lucide-react";
import { normalizeSubject } from "../utils/normalizeSubject";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateQuizMutation } from "../api/slices/quizApiSlice";
import { useCreateQuizQuestionMutation } from "../api/slices/quizQuestionApiSlice";
import { useCreateQuizRelationMutation } from "../api/slices/quizRelationApiSlice";

const { Panel } = Collapse;

const QuizReview = () => {
  const quiz = useSelector(getQuiz);
  let materia = normalizeSubject(quiz.subject);
  const question = useSelector(getQuestion);
  const dispatch = useDispatch();

  const [createQuiz, { data: quizData }] = useCreateQuizMutation();
  const [createQuizQuestion] = useCreateQuizQuestionMutation();
  const [createQuizRelation] = useCreateQuizRelationMutation();

  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (quizData) {
      setProcessing(true);
      const createQuestionsAndRelation = async () => {
        try {
          const quizId = quizData.id;
          await Promise.all(
            question.map((item) =>
              createQuizQuestion({ question: item, quizId })
            )
          );
          createQuizRelation({ quizId: quizData.id });

          notification.success({
            message: "Questionário publicado com sucesso!",
            description: "Você será redirecionado para a página de exercícios.",
          });
        } catch (error) {
          throw new Error(error.message);
        } finally {
          setProcessing(false);
          navigate("/exercises");
        }
      };
      createQuestionsAndRelation();
    }
  }, [quizData, createQuizQuestion, createQuizRelation, question, navigate]);

  const handlePublish = async () => {
    setProcessing(true);
    try {
      await createQuiz(quiz);
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
        title="Dados das questões"
        className="mb-4"
        extra={
          <Button type="text" onClick={() => dispatch(setStep(1))}>
            <Pencil size={20} color="#333" />
          </Button>
        }
      >
        <p>
          <strong>Número de questões:</strong> {question.length}
          <br />
        </p>
        <Collapse accordion ghost>
          {question.map((item, index) => (
            <Panel header={`Questão ${index + 1}`} key={index}>
              <p>
                <strong>Enunciado:</strong> {item.description}
              </p>
              <p>
                <strong>Resposta certa:</strong> {item.correct}
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
        Publicar questionário
      </Button>
    </>
  );
};

export default QuizReview;
