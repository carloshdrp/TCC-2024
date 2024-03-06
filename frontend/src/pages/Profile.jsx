import LayoutComponent from "./layout/LayoutComponent.jsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { useGetUsersQuery } from "../api/profileApiSlice";
import {
  UserRound,
  Archive,
  MessageCircleHeart,
  MessageCircleMore,
} from "lucide-react";
import { Avatar, Button, Spin } from "antd";
import UserLeague from "../components/UserLeague.jsx";
import coin from "../assets/coin.png";
import { Link } from "react-router-dom";

function Profile() {
  const user = useSelector(selectCurrentUser);
  const { data: userData, error, isLoading } = useGetUsersQuery(user.id);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  let content;
  if (isLoading) {
    content = <Spin fullscreen />;
  } else if (error) {
    content = <p>Erro: {error}</p>;
  } else if (userData) {
    // content = <p>{JSON.stringify(userData, null, 2)}</p>;
    content = (
      <>
        <header className="flex gap-3 p-3 bg-white shadow-md rounded-xl text-text">
          <Avatar
            shape="square"
            size={150}
            src={"http://localhost:8080/uploads/" + userData.avatar}
            icon={!userData.avatar && <UserRound />}
          />
          <div className="flex flex-col justify-between w-full">
            <p className="text-4xl font-semibold ">{userData.name}</p>
            <UserLeague />
            <div className="flex items-center gap-1">
              <img src={coin} alt="coin" className="w-5 h-5" />
              <span className="text-lg font-black text-yellow-500">
                {userData.points}
              </span>
              <p>Pontos totais</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="primary">Editar Perfil</Button>
            <Button type="default">
              <Link to="/logout">Sair da Conta</Link>
            </Button>
          </div>
        </header>

        <h2 className="text-text">Suas conquistas</h2>
        <div className="grid items-center justify-center w-full grid-flow-col bg-white rounded-lg shadow-md min-h-32">
          <div className="flex flex-col items-center justify-center p-2">
            <Archive size={96} opacity="70%" strokeWidth={1.5} />
            <p className="opacity-70">
              Botar as conquistas aqui e colocar os requisitos para ganhar
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-8 text-text">
          <div className="w-1/2">
            <h2>Atividades no Fórum</h2>
            <div className="grid grid-flow-col p-2 text-center bg-white rounded-lg shadow-md">
              <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
                <h3 className="m-0">Tópicos Abertos</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
              <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
                <h3 className="m-0">Tópicos Respondidos</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
              <div>
                <h3 className="m-0">Avaliações</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <h2>Atividades no Questionário</h2>
            <div className="grid grid-flow-col p-2 text-center bg-white rounded-lg shadow-md">
              <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
                <h3 className="m-0">Questionários Criados</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
              <div className="border-0 border-r-2 border-solid border-r-black border-opacity-10">
                <h3 className="m-0">Questionários Realizados</h3>
                <p className="text-4xl font-black "> 0</p>
              </div>
              <div>
                <h3 className="m-0">Avaliações</h3>
                <p className="text-4xl font-black"> 0</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-text">Seus Tópicos</h2>
        <div className="grid grid-cols-2 gap-8 text-text">
          <article className="flex flex-col p-2 bg-white rounded-lg">
            <h3 className="m-0">Título</h3>
            <p>
              Descrição do artigo vai vir nesta linha aqui na qual eu estou
              escrevendo.
            </p>
            <div className="w-full h-0.5 bg-black bg-opacity-25 rounded my-[5px]" />
            <div className="flex justify-between">
              <p>01/01/2023</p>
              <div className="flex gap-2">
                <div className="flex">
                  <MessageCircleMore />
                  <p>2</p>
                </div>
                <div className="flex">
                  <MessageCircleHeart />
                  <p>5</p>
                </div>
              </div>
            </div>
          </article>

          <article className="flex flex-col p-2 bg-white rounded-lg">
            <h3 className="m-0">Título</h3>
            <p>
              Descrição do artigo vai vir nesta linha aqui na qual eu estou
              escrevendo.
            </p>
            <div className="w-full h-0.5 bg-black bg-opacity-25 rounded my-[5px]" />
            <div className="flex justify-between">
              <p>01/01/2023</p>
              <div className="flex gap-2">
                <div className="flex">
                  <MessageCircleMore />
                  <p>2</p>
                </div>
                <div className="flex">
                  <MessageCircleHeart />
                  <p>5</p>
                </div>
              </div>
            </div>
          </article>

          <article className="flex flex-col p-2 bg-white rounded-lg">
            <h3 className="m-0">Título</h3>
            <p>
              Descrição do artigo vai vir nesta linha aqui na qual eu estou
              escrevendo.
            </p>
            <div className="w-full h-0.5 bg-black bg-opacity-25 rounded my-[5px]" />
            <div className="flex justify-between">
              <p>01/01/2023</p>
              <div className="flex gap-2">
                <div className="flex">
                  <MessageCircleMore />
                  <p>2</p>
                </div>
                <div className="flex">
                  <MessageCircleHeart />
                  <p>5</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </>
    );
  }

  return <LayoutComponent>{content}</LayoutComponent>;
}

export default Profile;
