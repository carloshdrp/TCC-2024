import bgPattern1 from "../../../assets/bg-pattern-1.jpg";
import { CheckIcon } from "lucide-react";

function Forum() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-[1fr,auto] bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col">
          <div className="p-8">
            <h2 className="text-4xl font-black text-center m-0">
              Fórum de perguntas
            </h2>
          </div>
          <div className="flex flex-col gap-4 px-8 pb-8">
            <p className="text-lg">
              O fórum de perguntas é um espaço onde você pode interagir com
              outros vestibulandos, esclarecer suas dúvidas, responder perguntas
              e aprofundar seu conhecimento.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <CheckIcon color="#3f51b5" className="w-8 h-8 flex-shrink-0" />
                <p>
                  Divisão por competências: Permite que você encontre
                  rapidamente o que precisa!
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <CheckIcon color="#3f51b5" className="w-8 h-8 flex-shrink-0" />
                <p>
                  Banco de Conhecimento: O fórum armazena discussões passadas,
                  criando um acervo de informações úteis para consulta rápida.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <CheckIcon color="#3f51b5" className="w-8 h-8 flex-shrink-0" />
                <p>
                  Resolução Colaborativa: Estudantes resolvem problemas juntos,
                  compartilhando diferentes abordagens.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-64">
          <img
            src={bgPattern1}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Background pattern"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
