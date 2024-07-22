const answers = [
  {
    description:
      'Para calcular a área de um círculo, use a fórmula A = πr², onde A é a área e r é o raio do círculo. π (pi) é aproximadamente 3,14159. Primeiro, meça o raio do círculo. Depois, eleve o raio ao quadrado (multiplique-o por si mesmo). Por fim, multiplique esse resultado por π. Por exemplo, se o raio for 5 cm, a área seria: A = π * 5² = 3,14159 * 25 ≈ 78,54 cm².',
    questionTitle: 'Como calcular a área de um círculo?',
  },
  {
    description:
      "'There' é usado para indicar lugar ou existência (ex: 'There is a book on the table'). 'Their' é um pronome possessivo (ex: 'It's their house'). 'They're' é a contração de 'they are' (ex: 'They're going to the party'). Uma dica é tentar substituir por 'they are' - se fizer sentido, use 'they're'; se for possessivo, use 'their'; caso contrário, provavelmente é 'there'.",
    questionTitle: 'Qual a diferença entre "there", "their" e "they\'re"?',
  },
  {
    description:
      'A fotossíntese é o processo pelo qual as plantas produzem seu próprio alimento usando luz solar, água e dióxido de carbono. As principais etapas são: 1) Absorção de luz pelas clorofilas; 2) Quebra da água em hidrogênio e oxigênio; 3) Fixação do CO2 em moléculas orgânicas; 4) Produção de glicose. O oxigênio é liberado como subproduto. Este processo ocorre principalmente nas folhas, nos cloroplastos.',
    questionTitle: 'Como funciona a fotossíntese?',
  },
  {
    description:
      'Uma redação dissertativa-argumentativa geralmente tem a seguinte estrutura: 1) Introdução: apresente o tema e sua tese; 2) Desenvolvimento: geralmente 2-3 parágrafos, cada um com um argumento principal que suporte sua tese; 3) Conclusão: reafirme sua tese, resuma seus argumentos e proponha uma solução ou reflexão final. Lembre-se de usar conectivos para ligar as ideias e manter um fluxo lógico entre os parágrafos.',
    questionTitle: 'Como estruturar uma redação dissertativa-argumentativa?',
  },
  {
    description:
      "As leis de Newton são fundamentais na física mecânica: 1ª Lei (Inércia): Um objeto em repouso permanece em repouso, e um objeto em movimento permanece em movimento, a menos que uma força externa atue sobre ele. 2ª Lei (F = ma): A força aplicada a um objeto é igual à sua massa vezes sua aceleração. 3ª Lei (Ação e Reação): Para cada ação, há uma reação igual e oposta. Estas leis explicam desde o movimento dos planetas até por que sentimos um 'tranco' quando um carro freia bruscamente.",
    questionTitle: 'Como funcionam as leis de Newton?',
  },
];

async function seedAnswers(tx) {
  const users = await tx.user.findMany();
  const questions = await tx.question.findMany({
    include: { user: true },
  });

  if (users.length === 0 || questions.length === 0) {
    console.log('❌ Nenhum usuário ou questão encontrada para associar às respostas');
    return;
  }

  const createAnswers = answers
    .map((answer) => {
      const question = questions.find((q) => q.title === answer.questionTitle);
      if (!question) {
        console.log(`❌ Questão não encontrada para a resposta: ${answer.questionTitle}`);
        return null;
      }

      const eligibleUsers = users.filter((user) => user.id !== question.userId);

      if (eligibleUsers.length === 0) {
        console.log(`❌ Nenhum usuário elegível para responder à pergunta: ${answer.questionTitle}`);
        return null;
      }

      const randomUser = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

      return tx.answer.create({
        data: {
          description: answer.description,
          userId: randomUser.id,
          questionId: question.id,
        },
      });
    })
    .filter(Boolean);

  await Promise.all(createAnswers);

  console.log('✅ Respostas criadas com sucesso');
}

module.exports = seedAnswers;
