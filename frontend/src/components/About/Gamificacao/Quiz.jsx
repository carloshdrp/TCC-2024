import bgPattern2 from "../../../assets/bg-pattern-2.jpg";
import { CheckIcon } from "lucide-react";

function Quiz() {
  return (
    <div className="h-screen w-[calc(100vw-180px)] flex items-center justify-center bg-background">
      <div className="w-4/6 grid grid-cols-[auto,auto,200px] grid-rows-[auto,2fr] bg-white m-16 rounded-lg overflow-hidden">
        <div className="col-span-2 p-8">
          <h2 className="text-4xl font-black text-center m-0">Questionários</h2>
        </div>
        <div className="relative row-span-2">
          <img
            src={bgPattern2}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Background pattern"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
        </div>
        <div className="pb-8 px-8 flex items-start">
          <p className="text-lg">
            Questionários interativos oferecem uma maneira de testar seus
            conhecimentos e se preparar para o vestibular. Com uma variedade de
            tópicos e níveis de dificuldade, você pode praticar no seu próprio
            ritmo e acompanhar seu progresso.
          </p>
        </div>
        <div className="flex flex-col separador pb-8">
          <div className="flex gap-2 items-center">
            <CheckIcon color="#FF4081" className="w-9 h-9" />
            <p>
              Criados pela comunidade: Usuários com permissão podem criar
              questionários e compartilhá-los com outros estudantes.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <CheckIcon color="#FF4081" className="w-8 h-8" />
            <p>
              Questionários aleatório: Quer fazer uma revisão geral? essa é a
              melhor opção para você.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <CheckIcon color="#FF4081" className="w-8 h-8" />
            <p>
              Acompanhe seu desempenho: Analise seus resultados e identifique
              áreas em que precisa melhorar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
