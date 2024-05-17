import LayoutComponent from "./layout/LayoutComponent.jsx";
import ExercisesMenu from "../components/Quiz/ExercisesMenu.jsx";
import { Badge, Button, Input } from "antd";
import QuizArticles from "../components/Quiz/QuizArticles.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getMenuTab } from "../redux/slices/quizMenuSlice.js";
import { reverseNormalizeSubject } from "../utils/normalizeSubject.js";
import { useEffect, useState } from "react";
import {
  selectCurrentUser,
  setUser,
  updateUserState,
} from "../redux/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../api/slices/profileApiSlice.js";
import { useGetQuizzesQuery } from "../api/slices/quizApiSlice.js";

const { Search } = Input;

function Exercises() {
  const menuTab = useSelector(getMenuTab);
  const [searchTitle, setSearchTitle] = useState("");

  const userState = useSelector(selectCurrentUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSearch = (value) => setSearchTitle(value);

  const { data: userData, refetch } = useGetUsersQuery(userState?.id);

  useEffect(() => {
    if (userState?.id) {
      refetch().then(() => {
        if (userData) {
          dispatch(updateUserState(userData));
        } else {
          dispatch(setUser(null));
        }
      });
    }
  }, [dispatch, refetch, userState?.id, userData]);

  const { data: quizzesData } = useGetQuizzesQuery();

  const handleRandomQuiz = async () => {
    try {
      const randomQuiz =
        quizzesData[Math.floor(Math.random() * quizzesData.length)];
      navigate(`/exercise/${randomQuiz.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LayoutComponent>
      <div className="grid grid-cols-12 gap-3 text-text">
        <ExercisesMenu />

        <div className="col-span-9 bg-white rounded-[10px] p-[10px] px-[20px] gap-[10px]">
          <div className="flex justify-between items-center">
            <h1 className="p-0 m-0 font-extrabold">{menuTab}</h1>

            <Search
              placeholder="Pesquisar questionário"
              allowClear
              onSearch={onSearch}
              style={{
                width: 400,
              }}
            />
          </div>
          {menuTab === "Descobrir" && (
            <div className="flex gap-[10px]">
              <div className="flex flex-col bg-[url('./assets/bg-discovery-card-1.png')] bg-center bg-repeat-round w-full p-[20px] text-white rounded-[10px]">
                <h2 className="m-0 text-[26px] font-medium">
                  Questionário aleatório
                </h2>
                <p className="mb-[50px]">Ideal para uma revisão geral</p>
                <Button type="primary" onClick={handleRandomQuiz}>
                  Começar
                </Button>
              </div>

              <div className="flex flex-col bg-[url('./assets/bg-discovery-card-2.png')] bg-center bg-repeat-round w-full p-[20px] text-white rounded-[10px]">
                <h2 className="m-0 text-[26px] font-medium">
                  Não entendeu alguma questão?
                </h2>
                <p className="mb-[50px]">Crie uma pergunta no fórum</p>
                <Button
                  type="primary"
                  className="bg-secondary hover:!bg-[#FF63A6]"
                  onClick={() => navigate("/forum")}
                >
                  Fórum
                </Button>
              </div>
            </div>
          )}

          {(userData?.role === "ADMIN" || userData?.role === "VERIFIED") && (
            <Badge.Ribbon
              text="+2 pontos"
              className="mt-1 text-sm"
              color="gold"
            >
              <Button
                type="primary"
                className="w-full mt-2 h-10 font-medium text-lg"
                onClick={() => navigate("create")}
              >
                Criar questionário
              </Button>
            </Badge.Ribbon>
          )}

          <QuizArticles
            menuTab={
              menuTab === "Seus questionários"
                ? menuTab
                : reverseNormalizeSubject(menuTab)
            }
            searchTitle={searchTitle}
          />
        </div>
      </div>
    </LayoutComponent>
  );
}

export default Exercises;
