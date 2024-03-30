import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronUp } from "lucide-react";

function ScrollTop() {
  const [pageYOffset, setPageYOffset] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => setPageYOffset(window.pageYOffset);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pageYOffset > 50) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: "easeInOut" },
      });
    } else {
      controls.start({
        opacity: 0,
        scale: 0,
        transition: { duration: 0.3 },
      });
    }
  }, [pageYOffset, controls]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <motion.button
      className="fixed w-10 h-10 text-white border-0 rounded-full cursor-pointer bg-secondary right-10 bottom-10 drop-shadow-xl"
      animate={controls}
      initial={{ opacity: 0 }}
      onClick={scrollToTop}
    >
      <ChevronUp />
    </motion.button>
  );
}

export default ScrollTop;
