import LayoutComponent from "./layout/LayoutComponent.jsx";
import Introducao from "../components/About/Introducao.jsx";
import Gamificacao from "../components/About/Gamificacao.jsx";
import Recursos from "../components/About/Recursos.jsx";

function About() {
  return (
    <LayoutComponent>
      <div className="relative overflow-x-clip text-text">
        <Introducao />

        <Recursos />

        <Gamificacao />

        <section
          id="acesso"
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
      </div>
    </LayoutComponent>
  );
}

export default About;
