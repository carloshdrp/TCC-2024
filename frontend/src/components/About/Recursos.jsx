import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Forum from "./Recursos/Forum.jsx";
import Quiz from "./Recursos/Quiz.jsx";

const Recursos = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  return (
    <section ref={targetRef} className="relative h-[200vh]" id="recursos">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-5xl relative h-full flex flex-col justify-center">
          <StaticCard component={Forum} />
          <AnimatedCard
            component={Quiz}
            progress={scrollYProgress}
            range={[0, 0.4, 0.6, 0.8]}
          />
        </div>
      </div>
    </section>
  );
};

const StaticCard = ({ component: Component }) => {
  return (
    <div className="w-full absolute left-0 right-0 h-auto max-h-[80vh] overflow-visible">
      <Component />
    </div>
  );
};

const AnimatedCard = ({ component: Component, progress, range }) => {
  const yRange = useTransform(progress, range, [600, 20, 20, 20]);
  const scaleRange = useTransform(progress, range, [0.8, 1, 1, 1]);
  const opacityRange = useTransform(progress, range, [0.6, 1, 1, 1]);

  const y = useSpring(yRange, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const scale = useSpring(scaleRange, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const opacity = useSpring(opacityRange, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex: 1,
      }}
      transition={{ duration: 1 }}
      className="w-full absolute left-0 right-0 h-auto max-h-[80vh] overflow-visible"
    >
      <Component />
    </motion.div>
  );
};

export default Recursos;
