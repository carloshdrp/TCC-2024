import { useState } from "react";
import { MessageCircleHeart, MessageCircleMore } from "lucide-react";
import { Pagination } from "antd";

export const QuestionsOverview = () => {
  const articles = {
    1: {
      id: 1,
      titulo: "Título",
      descricao:
        "Descrição do artigo vai vir nesta linha aqui na qual eu estou escrevendo.",
      data: "01/01/2023",
      comentarios: 2,
      curtidas: 5,
    },
    2: {
      id: 1,
      titulo: "Título",
      descricao:
        "Descrição do artigo vai vir nesta linha aqui na qual eu estou escrevendo.",
      data: "01/01/2023",
      comentarios: 2,
      curtidas: 5,
    },
    3: {
      id: 1,
      titulo: "Título",
      descricao:
        "Descrição do artigo vai vir nesta linha aqui na qual eu estou escrevendo.",
      data: "01/01/2023",
      comentarios: 2,
      curtidas: 5,
    },
    4: {
      id: 1,
      titulo: "Título",
      descricao:
        "Descrição do artigo vai vir nesta linha aqui na qual eu estou escrevendo.",
      data: "01/01/2023",
      comentarios: 2,
      curtidas: 5,
    },
    5: {
      id: 1,
      titulo: "Título",
      descricao:
        "Descrição do artigo vai vir nesta linha aqui na qual eu estou escrevendo.",
      data: "01/01/2023",
      comentarios: 2,
      curtidas: 5,
    },
    6: {
      id: 1,
      titulo: "Título",
      descricao:
        "Descrição do artigo vai vir nesta linha aqui na qual eu estou escrevendo.",
      data: "01/01/2023",
      comentarios: 2,
      curtidas: 5,
    },
    7: {
      id: 1,
      titulo: "Título",
      descricao:
        "Descrição do artigo vai vir nesta linha aqui na qual eu estou escrevendo.",
      data: "01/01/2023",
      comentarios: 2,
      curtidas: 5,
    },
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(5);

  const articleKeys = Object.keys(articles);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticleKeys = articleKeys.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const currentArticles = currentArticleKeys.map((key) => articles[key]);

  return (
    <>
      <div className="grid grid-cols-2 gap-8 mb-2 text-text">
        {currentArticles.map((article) => (
          <article
            className="flex flex-col p-2 bg-white rounded-lg"
            key={article.id}
          >
            <h3 className="m-0">{article.titulo}</h3>
            <p>{article.descricao}</p>
            <div className="w-full h-0.5 bg-black bg-opacity-25 rounded my-[5px]" />
            <div className="flex justify-between">
              <p>{article.data}</p>
              <div className="flex gap-2">
                <div className="flex">
                  <MessageCircleMore />
                  <p>{article.comentarios}</p>
                </div>
                <div className="flex">
                  <MessageCircleHeart />
                  <p>{article.curtidas}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Pagination
        current={currentPage}
        style={{ textAlign: "right" }}
        total={articleKeys.length}
        pageSize={articlesPerPage}
        onChange={(page) => {
          setCurrentPage(page);
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
        }}
      />
    </>
  );
};
