export const ForumTrendingTopics = () => {
  return (
    <div className="w-full h-fit bg-white rounded-[10px] p-[10px]">
      <p className="text-3xl font-medium text-center text-text mb-[10px]">
        Assuntos populares
      </p>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xl font-medium">#fisica</p>
          <p>120 perguntas no fórum</p>
        </div>
        <span className="bg-text w-full h-[2px] bg-opacity-40 rounded-full" />
        <div>
          <p className="text-xl font-medium">#fisica</p>
          <p>120 perguntas no fórum</p>
        </div>
        <span className="bg-text w-full h-[2px] bg-opacity-40 rounded-full" />

        <div>
          <p className="text-xl font-medium">#fisica</p>
          <p>120 perguntas no fórum</p>
        </div>
      </div>
    </div>
  );
};
