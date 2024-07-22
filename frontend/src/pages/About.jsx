import LayoutComponent from "./layout/LayoutComponent.jsx";
import Introducao from "../components/About/Introducao.jsx";
import Gamificacao from "../components/About/Gamificacao.jsx";
import Recursos from "../components/About/Recursos.jsx";
import Conquistas from "../components/About/Gamificacao/Conquistas";
import Seguranca from "../components/About/Seguranca.jsx";

function About() {
  return (
    <LayoutComponent>
      <div className="relative overflow-x-clip text-text">
        <Introducao />

        <Recursos />

        <Gamificacao />

        <Conquistas />

        <Seguranca />
      </div>
    </LayoutComponent>
  );
}

export default About;
