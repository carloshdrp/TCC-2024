import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-scroll";
import { ChevronsDown } from "lucide-react";

function Introducao() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <motion.section
      id="introducao"
      className="h-[calc(100vh-128px)] flex flex-col justify-between top-0"
      style={{ opacity }}
    >
      <motion.div
        className="h-full w-full bg-background bg-dot-black/[0.2] relative flex flex-col items-center justify-center"
        style={{ scale }}
      >
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <h1 className="m-0 text-7xl text-center font-black relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-text py-8">
          Descubra o que a plataforma <br />
          pode te oferecer
        </h1>
        <div className="flex items-center justify-center absolute bottom-0 opacity-60">
          <Link
            to="recursos"
            smooth={true}
            duration={500}
            offset={-128}
            className="text-text border-2 border-solid border-text px-4 py-1 rounded-full flex items-center w-fit justify-center gap-2 hover:text-text mb-6"
          >
            role para ver mais
            <div className="w-4 h-6 overflow-hidden">
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: [0.4, 0.1, 0.1, 0.5],
                  times: [0.2, 0.8, 0.8, 0.2],
                }}
              >
                <ChevronsDown size="16" />
              </motion.div>
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default Introducao;
