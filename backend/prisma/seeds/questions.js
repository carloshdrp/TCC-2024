const questions = [
  {
    title: 'Como calcular a área de um círculo?',
    description:
      'Estou tendo dificuldades em entender a fórmula para calcular a área de um círculo. Alguém pode me explicar passo a passo?',
    tag: 'Matemática',
    userId: '',
  },
  {
    title: 'Qual a diferença entre "there", "their" e "they\'re"?',
    description: 'Sempre me confundo com o uso dessas palavras em inglês. Podem me ajudar a entender quando usar cada uma?',
    tag: 'Linguagens',
    userId: '',
  },
  {
    title: 'Como funciona a fotossíntese?',
    description:
      'Preciso de uma explicação detalhada sobre o processo de fotossíntese nas plantas. Quais são as etapas principais?',
    tag: 'Ciências da Natureza',
    userId: '',
  },
  {
    title: 'Quais são as principais causas da Revolução Francesa?',
    description:
      'Estou estudando a Revolução Francesa e gostaria de entender melhor os fatores que levaram a esse evento histórico.',
    tag: 'Ciências Humanas',
    userId: '',
  },
  {
    title: 'Como estruturar uma redação dissertativa-argumentativa?',
    description: 'Quais são as partes essenciais de uma redação dissertativa-argumentativa e como devo organizá-las?',
    tag: 'Redação',
    userId: '',
  },
  {
    title: 'Quais são as regras básicas de acentuação na língua portuguesa?',
    description:
      'Tenho dificuldades em saber quando devo ou não acentuar as palavras. Quais são as principais regras que devo seguir?',
    tag: 'Linguagens',
    userId: '',
  },
  {
    title: 'Como resolver equações de segundo grau?',
    description:
      'Preciso de ajuda para entender o passo a passo da resolução de equações de segundo grau. Alguém pode explicar?',
    tag: 'Matemática',
    userId: '',
  },
  {
    title: 'Quais são os principais biomas brasileiros?',
    description:
      'Estou estudando geografia do Brasil e gostaria de saber mais sobre os principais biomas do país e suas características.',
    tag: 'Ciências da Natureza',
    userId: '',
  },
  {
    title: 'Como elaborar uma conclusão eficaz para um texto argumentativo?',
    description:
      'Tenho dificuldades em finalizar meus textos de forma impactante. Quais são as estratégias para uma boa conclusão?',
    tag: 'Redação',
    userId: '',
  },
  {
    title: 'Quais são as principais correntes filosóficas da Idade Moderna?',
    description:
      'Preciso de um resumo das principais correntes filosóficas que surgiram durante a Idade Moderna e seus representantes.',
    tag: 'Ciências Humanas',
    userId: '',
  },
  {
    title: 'Como funcionam as leis de Newton?',
    description: 'Gostaria de entender melhor as três leis de Newton e como elas se aplicam no nosso dia a dia.',
    tag: 'Ciências da Natureza',
    userId: '',
  },
  {
    title: 'Quais são as dicas para uma boa gestão do tempo de estudos?',
    description:
      'Estou tendo dificuldades em organizar meu tempo de estudo. Alguém pode compartilhar técnicas eficientes de gestão de tempo?',
    tag: 'Geral',
    userId: '',
  },
  {
    title: 'Como interpretar gráficos e tabelas em questões de vestibular?',
    description:
      'Sempre me confundo ao analisar gráficos e tabelas nas provas. Quais são as principais dicas para interpretar esses elementos corretamente?',
    tag: 'Geral',
    userId: '',
  },
  {
    title: 'Quais são as principais figuras de linguagem e como identificá-las?',
    description: 'Preciso de ajuda para entender e identificar as principais figuras de linguagem em textos literários.',
    tag: 'Linguagens',
    userId: '',
  },
  {
    title: 'Como calcular probabilidades básicas?',
    description:
      'Estou com dificuldades em entender o conceito de probabilidade e como realizar cálculos simples. Alguém pode me ajudar?',
    tag: 'Matemática',
    userId: '',
  },
];

async function seedQuestions(tx) {
  const users = await tx.user.findMany();

  if (users.length === 0) {
    console.log('❌ Nenhum usuário encontrado para associar às perguntas');
    return;
  }

  const createQuestions = questions.map((question, index) => {
    const user = users[index % users.length];
    return tx.question.create({
      data: {
        ...question,
        userId: user.id,
      },
    });
  });

  await Promise.all(createQuestions);

  console.log('✅ Perguntas criadas com sucesso');
}

module.exports = seedQuestions;
