import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Forum from "./Gamificacao/Forum.jsx";
import Quiz from "./Gamificacao/Quiz.jsx";

const Gamificacao = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh]" id="gamificacao">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex relative">
          <Forum />
          <Quiz />
          <Forum />
        </motion.div>
      </div>
    </section>
  );
};

export default Gamificacao;
