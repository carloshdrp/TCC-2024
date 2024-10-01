import { useEffect, useState } from "react";
import { API_AVATAR } from "../../../config/index.js";
import { Progress } from "antd";
import { useScroll, useTransform, useSpring } from "framer-motion";

const achievements = [
  {
    title: "Edite seu perfil",
    description: "Edite o seu perfil pela primeira vez",
    condition: "EDIT_PROFILE",
    imagePath: "/achievements/edit-profile.png",
  },
  {
    title: "Primeiros passos",
    description: "Conquiste seu primeiro ponto na plataforma",
    condition: "FIRST_POINT",
    imagePath: "/achievements/first-point.png",
  },
  {
    title: "Alguém pode me ajudar?",
    description: "Crie sua primeira pergunta no fórum",
    condition: "FIRST_QUESTION",
    imagePath: "/achievements/first-question.png",
  },
  {
    title: "Pegando o jeito",
    description: "Complete 10 questionários",
    condition: "COMPLETE_10_QUIZZES",
    imagePath: "/achievements/complete-10-quizzes.png",
  },
];

const Conquistas = () => {
  const { scrollYProgress } = useScroll();
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const progressValue = useTransform(scrollYProgress, [0.55, 0.875], [0, 100]);
  const yRange = useTransform(scrollYProgress, [0.55, 0.875], [0, -450]);

  const y = useSpring(yRange, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = progressValue.on("change", (v) => {
      setCurrentProgress(Math.round(v));
      if (v >= 100) {
        setIsCompleted(true);
      } else {
        setIsCompleted(false);
      }
    });

    return () => unsubscribe();
  }, [progressValue]);

  return (
    <section
      id="conquistas"
      className="w-full h-[125vh] flex flex-col mt-10 items-center justify-center"
    >
      <div className="text-center mb-52">
        <h2 className="m-0 mb-4 text-6xl">
          Seja{" "}
          <span className="text-secondary fonte font-bold">recompensado</span>{" "}
          pelo seu estudo!
        </h2>
        <p className="text-lg">
          Através das conquistas, você possui metas claras para serem alcançadas
        </p>
      </div>

      <div className="relative w-full max-w-4xl h-[450px]">
        <div
          className="sticky top-1/2 transform -translate-y-1/2"
          style={{ y }}
        >
          <article
            className={`flex mx-auto w-fit border-gray-200 border-2 border-solid rounded-2xl px-4 bg-background z-10 relative transition-all shadow-xl ${
              isCompleted ? "scale-110" : "grayscale"
            }`}
          >
            <img
              src={API_AVATAR + "achievements/legend.png"}
              alt="Icone conquista"
              className="w-36 h-36"
            />
            <div className="flex flex-col justify-between m-4">
              <div>
                <h2 className="text-text text-3xl m-0">Lenda</h2>
                <p>O requisito para essa conquista é um mistério...</p>
              </div>

              <Progress percent={currentProgress} />
            </div>
          </article>

          {achievements.map((achievement, index) => {
            const isLeft = index % 2 === 0;
            const isTop = index < 2;
            const topPosition = isTop ? "-top-28" : "top-28";
            const rotation = isLeft
              ? isTop
                ? "-rotate-12"
                : "rotate-12"
              : isTop
                ? "rotate-12"
                : "-rotate-12";
            const horizontalPosition = isLeft ? "-left-16" : "-right-16";

            return (
              <article
                key={achievement.condition}
                className={`flex mx-auto w-fit border-gray-200 border-2 border-solid rounded-2xl scale-90 px-4 bg-white grayscale opacity-30 absolute ${topPosition} ${rotation} ${horizontalPosition}`}
              >
                <img
                  src={API_AVATAR + achievement.imagePath}
                  alt={`Ícone da conquista ${achievement.title}`}
                  className="w-36 h-36"
                />
                <div className="flex flex-col justify-between m-4">
                  <div>
                    <h2 className="text-text text-3xl m-0">
                      {achievement.title}
                    </h2>
                    <p>{achievement.description}</p>
                  </div>

                  <Progress />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Conquistas;
