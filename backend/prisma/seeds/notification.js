const notificationCategories = ['REPORT', 'RATING', 'ACHIEVEMENT', 'QUIZ_COMPLETED'];

async function seedNotifications(tx) {
  const users = await tx.user.findMany();
  const questions = await tx.question.findMany();
  const answers = await tx.answer.findMany();
  const quizzes = await tx.quiz.findMany();

  if (users.length === 0) {
    console.log('❌ Nenhum usuário encontrado para criar notificações');
    return;
  }

  const resources = [
    ...questions.map((q) => ({ id: q.id, type: 'QUESTION' })),
    ...answers.map((a) => ({ id: a.id, type: 'ANSWER' })),
    ...quizzes.map((q) => ({ id: q.id, type: 'QUIZ' })),
  ];

  if (resources.length === 0) {
    console.log('❌ Nenhum recurso encontrado para associar às notificações');
    return;
  }

  const numberOfNotifications = Math.floor(Math.random() * 31) + 20;

  const notificationCreationPromises = Array.from({ length: numberOfNotifications }, () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory = notificationCategories[Math.floor(Math.random() * notificationCategories.length)];
    const randomResource = resources[Math.floor(Math.random() * resources.length)];

    return tx.notification.create({
      data: {
        recipientId: randomUser.id,
        content: `Nova notificação de ${randomCategory.toLowerCase()}`,
        category: randomCategory,
        resourceId: randomResource.id,
      },
    });
  });

  const createdNotifications = await Promise.all(notificationCreationPromises);

  console.log(`✅ ${createdNotifications.length} notificações criadas com sucesso`);
}

module.exports = seedNotifications;
