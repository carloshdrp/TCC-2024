import React, { useRef } from "react";
import acesso from "../../assets/acesso.png";
import { Dot } from "lucide-react";
import { motion, useInView } from "framer-motion";

const Seguranca = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="acesso"
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="m-0 text-6xl"
      >
        Grupos de acesso{" "}
        <span className="text-primary fonte font-bold">personalizados</span>!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg mb-12 mt-4"
      >
        Permissões baseada em contribuições, promovendo conteúdo de maior
        qualidade
      </motion.p>

      <div className="flex items-center w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center h-full w-2/5"
        >
          <img
            src={acesso}
            alt="illustração acesso"
            className="w-4/5 rounded-lg shadow-lg"
          />
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-3/5 flex items-center justify-center"
        >
          <ul className="list-none p-0 w-full flex flex-col gap-3">
            {[
              {
                title: "Administradores",
                subtitle: "Equipe interna",
                description: "Gerenciam conteúdos e moderam a plataforma",
                bgColor: "bg-primary",
              },
              {
                title: "Estudiosos",
                subtitle: "Desbloqueado com 10 curtidas recebidas",
                description: "Respondem perguntas e criam questionários",
                bgColor: "bg-secondary",
              },
              {
                title: "Iniciantes",
                subtitle: "Acesso imediato após registro",
                description: "Fazem perguntas e praticam com questionários",
                bgColor: "bg-gray-600",
              },
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className={`${item.bgColor} py-3 px-6 text-background rounded-full hover:bg-opacity-90 transition-all`}
              >
                <div>
                  <p className="text-lg font-medium leading-4 flex items-center gap-1">
                    {item.title} <Dot size="16" />
                    <span className="text-sm opacity-80">{item.subtitle}</span>
                  </p>
                  <p className="opacity-80 leading-4 mt-1">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default Seguranca;
