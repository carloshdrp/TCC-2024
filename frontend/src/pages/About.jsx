import LayoutComponent from "./layout/LayoutComponent.jsx";
import { Link } from "react-scroll";
import { ChevronsDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

function About() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <LayoutComponent>
      <div className="relative overflow-x-clip text-text">
        <motion.section
          id="introducao"
          className="h-[calc(100vh-128px)] flex flex-col justify-between sticky top-0"
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
                offset={520}
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

        <motion.div className="relative z-10" style={{ y }}>
          <section
            id="recursos"
            className="min-h-screen bg-white flex flex-col items-center justify-center"
          >
            <p className="text-4xl font-bold">Recursos</p>
            <p>fórum / quiz</p>
          </section>

          <section
            id="gamificacao"
            className="min-h-screen bg-background flex flex-col items-center justify-center"
          >
            <p className="text-4xl font-bold">Gamificação</p>
            <p>emblemas/ conquistas / pontos</p>
          </section>

          <section
            id="recursos"
            className="min-h-screen bg-white flex flex-col items-center justify-center"
          >
            <p className="text-4xl font-bold">Níveis de acesso</p>
            <p>iniciante / estudioso / adm</p>
          </section>

          <section
            id="explorar"
            className="min-h-screen bg-white flex flex-col items-center justify-center"
          >
            <p className="text-4xl font-bold">Comece a Explorar</p>
            <p>registrar-se</p>
          </section>
        </motion.div>
      </div>
    </LayoutComponent>
  );
}

export default About;
