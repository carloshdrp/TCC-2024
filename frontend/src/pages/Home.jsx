import LayoutComponent from "./layout/LayoutComponent.jsx";
import lineImage1 from "../assets/line-1.svg";
import lineImage2 from "../assets/line-2.svg";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

function Home() {
  return (
    <LayoutComponent>
      <div className="h-[calc(100vh-128px)] flex flex-col items-center gap-[60px] justify-center text-center bg-home">
        <h2 className=" text-8xl text-text w-[750px] z-10 my-0" id="header">
          Transforme seu{" "}
          <motion.span
            initial={{ color: "#333" }}
            animate={{ color: "#3F51B5" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            aprendizado{" "}
            <motion.img
              src={lineImage1}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut", delay: 0.4 }}
              className="absolute bottom-0 -left-3"
            ></motion.img>
          </motion.span>
          em uma{" "}
          <motion.span
            initial={{ color: "#333" }}
            animate={{ color: "#FF4081" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            aventura{" "}
            <motion.img
              src={lineImage2}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut", delay: 0.2 }}
              className="absolute bottom-0 -left-3"
            ></motion.img>
          </motion.span>
        </h2>
        <p className="text-lg  w-[620px] z-10 my-0">
          Explore diversas atividades interativas e divertidas para enriquecer
          seu processo de aprendizagem e desenvolvimento pessoal.
        </p>
        <Link to="/register" className="btn-home">
          <p className="text-white">Inicie sua jornada</p>
          <div className="icon-container w-[20px] h-[20px] bg-background relative flex items-center justify-center rounded-full">
            <ArrowUpRight size="16" className="icon text-primary" />
          </div>
        </Link>
      </div>
    </LayoutComponent>
  );
}

export default Home;
