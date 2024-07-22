const reasons = ['SPAM', 'INAPROPRIADO', 'OFENSIVO', 'LINKS', 'OUTRO'];
const statuses = ['PENDING', 'ACCEPTED', 'REJECTED'];

async function seedReports(tx) {
  const users = await tx.user.findMany();
  const questions = await tx.question.findMany();
  const answers = await tx.answer.findMany();
  const quizzes = await tx.quiz.findMany();

  if (users.length === 0) {
    console.log('❌ Nenhum usuário encontrado para criar denúncias');
    return;
  }

  const reportables = [
    ...questions.map((q) => ({ id: q.id, type: 'QUESTION' })),
    ...answers.map((a) => ({ id: a.id, type: 'ANSWER' })),
    ...quizzes.map((q) => ({ id: q.id, type: 'QUIZ' })),
  ];

  if (reportables.length === 0) {
    console.log('❌ Nenhum conteúdo encontrado para ser denunciado');
    return;
  }

  const numberOfReports = Math.floor(Math.random() * 11) + 5;

  const reportCreationPromises = Array.from({ length: numberOfReports }, () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomReportable = reportables[Math.floor(Math.random() * reportables.length)];
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return tx.report.create({
      data: {
        userId: randomUser.id,
        reason: randomReason,
        description: `Denúncia de ${randomReason.toLowerCase()} para ${randomReportable.type.toLowerCase()}`,
        status: randomStatus,
        message: randomStatus === 'PENDING' ? null : `Resposta à denúncia de ${randomReason.toLowerCase()}`,
        reportableId: randomReportable.id,
        reportableType: randomReportable.type,
      },
    });
  });

  const createdReports = await Promise.all(reportCreationPromises);

  console.log(`✅ ${createdReports.length} denúncias criadas com sucesso`);
}

module.exports = seedReports;
