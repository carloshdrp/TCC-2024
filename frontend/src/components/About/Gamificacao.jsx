import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";
import CountUp from "react-countup";
import topaz from "../../assets/Leagues/topaz.png";
import ruby from "../../assets/Leagues/ruby.png";
import emerald from "../../assets/Leagues/emerald.png";
import ametist from "../../assets/Leagues/ametist.png";
import diamond from "../../assets/Leagues/diamond.png";

const Gamificacao = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const [isExploding, setIsExploding] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [prevLikes, setPrevLikes] = useState(0);

  const leagues = [
    { name: "Topaz", image: topaz, color: "bg-orange-200", threshold: 0 },
    { name: "Rubi", image: ruby, color: "bg-red-200", threshold: 10 },
    { name: "Esmeralda", image: emerald, color: "bg-green-200", threshold: 20 },
    { name: "Ametista", image: ametist, color: "bg-purple-200", threshold: 30 },
    { name: "Diamante", image: diamond, color: "bg-cyan-200", threshold: 40 },
  ];

  const leagueIndex = useMotionValue(0);
  const likes = useMotionValue(0);

  useEffect(() => {
    const updateValues = () => {
      const latest = scrollYProgress.get();
      const maxLikes = leagues[leagues.length - 1].threshold * 1.2;
      const newLikes = Math.floor(latest * maxLikes);

      likes.set(newLikes);
      setPrevLikes(currentLikes);
      setCurrentLikes(newLikes);

      const newIndex = leagues.findIndex(
        (league, index) =>
          newLikes >= league.threshold &&
          (index === leagues.length - 1 ||
            newLikes < leagues[index + 1].threshold),
      );
      leagueIndex.set(newIndex);

      if (newIndex === leagues.length - 1 && !isExploding) {
        setIsExploding(true);
      }
    };

    const unsubscribeProgress = scrollYProgress.onChange(updateValues);

    return () => {
      unsubscribeProgress();
    };
  }, [scrollYProgress, leagues, leagueIndex, likes, isExploding, currentLikes]);
  return (
    <section ref={targetRef} className="relative h-[300vh]" id="gamificacao">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-6xl font-bold mb-16 spa">
            Curtidas são seu{" "}
            <span className="text-secondary fonte font-bold">combustível</span>{" "}
            <br className="mb-4" /> para{" "}
            <span className="text-primary fonte font-bold">evoluir</span> de
            liga!
          </h2>
          <div className="text-xl mb-8">
            <CountUp start={prevLikes} end={currentLikes} duration={0.5}>
              {({ countUpRef }) => (
                <div>
                  <span ref={countUpRef} className="font-bold" />
                  <span> curtidas recebidas</span>
                </div>
              )}
            </CountUp>
          </div>
          <div className="flex gap-8 justify-center">
            {leagues.map((league, index) => (
              <motion.div
                key={league.name}
                style={{
                  scale: useTransform(
                    leagueIndex,
                    [index - 1, index, index + 1],
                    [1, 1.2, 1],
                  ),
                  opacity: useTransform(
                    leagueIndex,
                    [index - 1, index, index + 1],
                    [0.5, 1, 0.5],
                  ),
                  boxShadow: useTransform(leagueIndex, (value) =>
                    value === index ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                  ),
                }}
                transition={{
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  boxShadow: { duration: 0.2 },
                }}
                className={`flex flex-col items-center gap-2 px-4 py-2 ${league.color} rounded-xl`}
              >
                <motion.img
                  src={league.image}
                  className="w-20 h-20"
                  alt={league.name}
                  animate={{
                    scale: useTransform(leagueIndex, (value) =>
                      value === index ? 1.1 : 1,
                    ),
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 30 },
                  }}
                />
                <p className="text-lg font-semibold">{league.name}</p>
              </motion.div>
            ))}
          </div>
          {isExploding && (
            <div className="flex w-full items-center justify-center">
              <ConfettiExplosion
                force={1}
                duration={4000}
                particleCount={250}
                width={1920}
                colors={["#3F51B5", "#FF4081"]}
                onComplete={() => setIsExploding(true)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Gamificacao;
