import bgPattern2 from "../../../assets/bg-pattern-2.jpg";
import { CheckIcon } from "lucide-react";

function Quiz() {
  return (
    <div className="flex items-center justify-center text-background">
      <div className="w-full max-w-5xl grid grid-cols-[1fr,auto] bg-primary rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col">
          <div className="p-8">
            <h2 className="text-4xl font-black text-center m-0">
              Questionários
            </h2>
          </div>
          <div className="flex flex-col gap-4 px-8 pb-8">
            <p className="text-lg">
              Questionários interativos oferecem uma maneira de testar seus
              conhecimentos e se preparar para o vestibular. Com uma variedade
              de tópicos e níveis de dificuldade, você pode praticar no seu
              próprio ritmo e acompanhar seu progresso.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <CheckIcon color="#FF4081" className="w-8 h-8 flex-shrink-0" />
                <p>
                  Criados pela comunidade: Usuários com permissão podem criar
                  questionários e compartilhá-los com outros estudantes.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <CheckIcon color="#FF4081" className="w-8 h-8 flex-shrink-0" />
                <p>
                  Questionários aleatório: Quer fazer uma revisão geral? essa é
                  a melhor opção para você.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <CheckIcon color="#FF4081" className="w-8 h-8 flex-shrink-0" />
                <p>
                  Acompanhe seu desempenho: Analise seus resultados e
                  identifique áreas em que precisa melhorar.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-64">
          <img
            src={bgPattern2}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Background pattern"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
