import { useGetForumQuestionsQuery } from "../../api/slices/forumApiSlice.js";
import { useEffect } from "react";
import { Spin } from "antd";

export const ForumTrendingTopics = () => {
  const {
    data: questionsData,
    error: questionError,
    isLoading: questionLoading,
    refetch,
  } = useGetForumQuestionsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  let content;
  if (questionLoading) {
    content = (
      <Spin
        tip="Buscando perguntas..."
        size="large"
        className="rounded-[10px] bg-white bg-opacity-100"
      >
        <div className="w-full h-24 mt-11 " />
      </Spin>
    );
  } else if (questionError) {
    content = <p>Erro</p>;
  } else if (questionsData) {
    const tagCounts = questionsData.reduce((counts, question) => {
      const tagName = question.tag;
      if (!counts[tagName]) {
        counts[tagName] = 0;
      }
      counts[tagName]++;
      return counts;
    }, {});

    const tagCountPairs = Object.entries(tagCounts);

    tagCountPairs.sort((a, b) => b[1] - a[1]);

    const topThreeTags = tagCountPairs.slice(0, 3);

    content = (
      <div className="w-full h-fit bg-white rounded-[10px] p-[10px]">
        <p className="text-3xl font-medium text-center text-text mb-[10px]">
          Tópicos populares
        </p>
        <div className="flex flex-col gap-3 divide-y divide-solid divide-black divide-opacity-20">
          {topThreeTags.map(([tagName, count], index) => (
            <div key={index} className="border-0">
              <p className="text-xl font-medium">{tagName}</p>
              <p>{count} perguntas no fórum</p>
              {index < topThreeTags.length - 1 && (
                <span className="bg-text w-full h-[2px] bg-opacity-40 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return content;
};
