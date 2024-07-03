import bgPattern1 from "../../../assets/bg-pattern-1.jpg";
import { CheckIcon } from "lucide-react";

function Forum() {
  return (
    <div className="h-screen w-[calc(100vw-180px)] flex items-center justify-center bg-background">
      <div className="w-4/6 grid grid-cols-[auto,auto,200px] grid-rows-[auto,2fr] bg-white m-16 rounded-lg overflow-hidden">
        <div className="col-span-2 p-8">
          <h2 className="text-4xl font-black text-center m-0">
            Fórum de perguntas
          </h2>
        </div>
        <div className="relative row-span-2">
          <img
            src={bgPattern1}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Background pattern"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
        </div>
        <div className="pb-8 px-8 flex items-start">
          <p className="text-lg">
            O fórum de perguntas é um espaço onde você pode interagir com outros
            vestibulandos, esclarecer suas dúvidas, responder perguntas e
            aprofundar seu conhecimento.
          </p>
        </div>
        <div className="flex flex-col separador pb-8">
          <div className="flex gap-2 items-center">
            <CheckIcon color="#3f51b5" className="w-7 h-7" />
            <p>
              Divisão por competências: Permite que você encontre rapidamente o
              que precisa!
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <CheckIcon color="#3f51b5" className="w-9 h-9" />
            <p>
              Banco de Conhecimento: O fórum armazena discussões passadas,
              criando um acervo de informações úteis para consulta rápida.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <CheckIcon color="#3f51b5" className="w-8 h-8" />
            <p>
              Resolução Colaborativa: Estudantes resolvem problemas juntos,
              compartilhando diferentes abordagens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
