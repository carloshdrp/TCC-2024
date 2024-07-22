async function seedRatings(tx) {
  const users = await tx.user.findMany();
  const questions = await tx.question.findMany();
  const answers = await tx.answer.findMany();
  const quizzes = await tx.quiz.findMany();

  if (users.length === 0) {
    console.log('❌ Nenhum usuário encontrado para criar curtidas');
    return;
  }

  const rateables = [
    ...questions.map((q) => ({ id: q.id, type: 'QUESTION' })),
    ...answers.map((a) => ({ id: a.id, type: 'ANSWER' })),
    ...quizzes.map((q) => ({ id: q.id, type: 'QUIZ' })),
  ];

  if (rateables.length === 0) {
    console.log('❌ Nenhum conteúdo encontrado para ser curtido');
    return;
  }

  const numberOfRatings = Math.floor(Math.random() * 21) + 10;

  const ratingCreationPromises = Array.from({ length: numberOfRatings }, () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomRateable = rateables[Math.floor(Math.random() * rateables.length)];

    return tx.rating.create({
      data: {
        userId: randomUser.id,
        rateableId: randomRateable.id,
        rateableType: randomRateable.type,
      },
    });
  });

  const createdRatings = await Promise.all(ratingCreationPromises);

  console.log(`✅ ${createdRatings.length} curtidas criadas com sucesso`);
}

module.exports = seedRatings;
