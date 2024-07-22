const quizzes = [
  {
    title: 'Matemática Básica',
    description: 'Teste seus conhecimentos em matemática fundamental',
    subject: 'MATEMATICA',
    questions: [
      {
        description: 'Quanto é 7 x 8?',
        correct: '56',
        wrong1: '54',
        wrong2: '58',
        wrong3: '62',
        wrong4: '48',
      },
      {
        description: 'Qual é a raiz quadrada de 144?',
        correct: '12',
        wrong1: '10',
        wrong2: '14',
        wrong3: '16',
        wrong4: '18',
      },
      {
        description: 'Se x + 5 = 12, quanto vale x?',
        correct: '7',
        wrong1: '5',
        wrong2: '6',
        wrong3: '8',
        wrong4: '9',
      },
    ],
  },
  {
    title: 'História do Brasil',
    description: 'Teste seus conhecimentos sobre a história brasileira',
    subject: 'HISTORIA',
    questions: [
      {
        description: 'Em que ano o Brasil se tornou independente de Portugal?',
        correct: '1822',
        wrong1: '1808',
        wrong2: '1889',
        wrong3: '1500',
        wrong4: '1789',
      },
      {
        description: 'Quem foi o primeiro presidente do Brasil?',
        correct: 'Deodoro da Fonseca',
        wrong1: 'Getúlio Vargas',
        wrong2: 'Dom Pedro II',
        wrong3: 'Juscelino Kubitschek',
        wrong4: 'Tancredo Neves',
      },
      {
        description: 'Qual foi o período da ditadura militar no Brasil?',
        correct: '1964-1985',
        wrong1: '1930-1945',
        wrong2: '1889-1930',
        wrong3: '1954-1964',
        wrong4: '1985-2000',
      },
    ],
  },
  {
    title: 'Gramática Portuguesa',
    description: 'Teste seus conhecimentos em gramática da língua portuguesa',
    subject: 'PORTUGUES',
    questions: [
      {
        description: "Qual é o plural de 'cidadão'?",
        correct: 'Cidadãos',
        wrong1: 'Cidadões',
        wrong2: 'Cidadãs',
        wrong3: 'Cidadãoes',
        wrong4: 'Cidadãs',
      },
      {
        description: 'Qual das seguintes palavras é um advérbio?',
        correct: 'Rapidamente',
        wrong1: 'Rápido',
        wrong2: 'Rapidez',
        wrong3: 'Veloz',
        wrong4: 'Ligeiro',
      },
      {
        description: "Qual é o antônimo de 'efêmero'?",
        correct: 'Duradouro',
        wrong1: 'Passageiro',
        wrong2: 'Breve',
        wrong3: 'Fugaz',
        wrong4: 'Momentâneo',
      },
    ],
  },
];

async function seedQuizzes(tx) {
  const users = await tx.user.findMany();

  if (users.length === 0) {
    console.log('❌ Nenhum usuário encontrado para associar aos quizzes');
    return;
  }

  const quizCreationPromises = quizzes.map((quiz) => {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    return tx.quiz.create({
      data: {
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        userId: randomUser.id,
        Question: {
          create: quiz.questions,
        },
      },
    });
  });

  const createdQuizzes = await Promise.all(quizCreationPromises);

  createdQuizzes.forEach((quiz) => {
    console.log(`|- Quiz "${quiz.title}" criado com sucesso`);
  });

  console.log('✅ Questionários criados com sucesso');
}

module.exports = seedQuizzes;
