const { prisma } = require('../config/database');
const badgesConfig = require('../config/badges');

const badgeProgress = async (ownerId) => {
  const [questionRatings, answerRatings, quizRatings] = await Promise.all([
    prisma.rating.count({
      where: {
        rateableType: 'QUESTION',
        rateableId: {
          in: await prisma.question
            .findMany({
              where: { userId: ownerId },
              select: { id: true },
            })
            .then((questions) => questions.map((q) => q.id)),
        },
      },
    }),
    prisma.rating.count({
      where: {
        rateableType: 'ANSWER',
        rateableId: {
          in: await prisma.answer
            .findMany({
              where: { userId: ownerId },
              select: { id: true },
            })
            .then((answers) => answers.map((a) => a.id)),
        },
      },
    }),
    prisma.rating.count({
      where: {
        rateableType: 'QUIZ',
        rateableId: {
          in: await prisma.quiz
            .findMany({
              where: { userId: ownerId },
              select: { id: true },
            })
            .then((quizzes) => quizzes.map((q) => q.id)),
        },
      },
    }),
  ]);

  const totalRatings = questionRatings + answerRatings + quizRatings;

  const newLeague = Object.entries(badgesConfig.leagues).reduce(
    (league, [key, threshold]) => (totalRatings >= threshold ? key : league),
    'Topaz',
  );

  return { totalRatings, newLeague };
};

const updateUserLeague = async (userId, newLeague) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { league: true, role: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const updates = { league: newLeague };

  if (newLeague !== 'Topaz' && user.role === 'INICIANTE') {
    updates.role = 'ESTUDIOSO';
  }

  if (user.league !== newLeague) {
    await prisma.user.update({
      where: { id: userId },
      data: updates,
    });
  }
};

const recalculateUserLeague = async (userId) => {
  const { totalRatings, newLeague } = await badgeProgress(userId);
  await updateUserLeague(userId, newLeague);
  return { totalRatings, newLeague };
};

module.exports = {
  badgeProgress,
  updateUserLeague,
  recalculateUserLeague,
};
