const conquistas = [
  {
    title: 'Edite seu perfil',
    description: 'Edite o seu perfil pela primeira vez',
    condition: 'EDIT_PROFILE',
    imagePath: '/achievements/edit-profile.png',
  },
  {
    title: 'Primeiros passos',
    description: 'Conquiste seu primeiro ponto na plataforma',
    condition: 'FIRST_POINT',
    imagePath: '/achievements/first-point.png',
  },
  {
    title: 'Alguém pode me ajudar?',
    description: 'Crie sua primeira pergunta no fórum',
    condition: 'FIRST_QUESTION',
    imagePath: '/achievements/first-question.png',
  },
  {
    title: 'Pegando o jeito',
    description: 'Complete 10 questionários',
    condition: 'COMPLETE_10_QUIZZES',
    imagePath: '/achievements/complete-10-quizzes.png',
  },
  {
    title: 'Estudioso',
    description: 'Evolua seu nível de permissão na plataforma',
    condition: 'LEVEL_UP',
    imagePath: '/achievements/level-up.png',
  },
  {
    title: 'Eu sei a resposta',
    description: 'Responda sua primeira pergunta no fórum',
    condition: 'FIRST_ANSWER',
    imagePath: '/achievements/first-answer.png',
  },
  {
    title: 'Agora eu quero ver',
    description: 'Crie seu primeiro questionário',
    condition: 'FIRST_QUIZ',
    imagePath: '/achievements/first-quiz.png',
  },
  {
    title: 'Lenda',
    description: 'O requisito para essa conquista é um mistério...',
    condition: 'REACH_MAX_LEAGUE',
    imagePath: '/achievements/legend.png',
  },
];

async function seedConquistas(tx) {
  const createConquistas = conquistas.map((conquista) =>
    tx.achievement.create({
      data: conquista,
    }),
  );

  await Promise.all(createConquistas);

  console.log('✅ Conquistas criadas com sucesso');
}

module.exports = seedConquistas;
