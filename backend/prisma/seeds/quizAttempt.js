async function seedQuizAttempts(tx) {
  const users = await tx.user.findMany();
  const quizzes = await tx.quiz.findMany({
    include: { Question: true },
  });

  if (users.length === 0 || quizzes.length === 0) {
    console.log('❌ Nenhum usuário ou quiz encontrado para criar tentativas');
    return;
  }

  const attemptCreationPromises = quizzes.flatMap((quiz) => {
    const numberOfAttempts = Math.floor(Math.random() * 3) + 1;

    return Array.from({ length: numberOfAttempts }, () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      return tx.quizAttempt.create({
        data: {
          quizId: quiz.id,
          userId: randomUser.id,
          score: Math.floor(Math.random() * (quiz.Question.length + 1)), // Score aleatório
          QuizQuestionAnswer: {
            create: quiz.Question.map((question) => ({
              quizQuestionId: question.id,
              userId: randomUser.id,
              choice: ['correct', 'wrong1', 'wrong2', 'wrong3', 'wrong4'][Math.floor(Math.random() * 5)],
            })),
          },
        },
      });
    });
  });

  const createdAttempts = await Promise.all(attemptCreationPromises);

  console.log(`✅ ${createdAttempts.length} tentativas em questionários criadas com sucesso`);
}

module.exports = seedQuizAttempts;
