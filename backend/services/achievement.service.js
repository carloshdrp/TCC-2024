const { prisma } = require('../config/database');
const { createNotification } = require('./notification.service');
const { getUserSocket } = require('../socketManager');

const achievementConditions = {
  EDIT_PROFILE: (user) => user.lastProfileEdit > user.createdAt,
  FIRST_POINT: (user) => user.points > 0,
  FIRST_QUESTION: (user) => user.Question.length > 0,
  COMPLETE_10_QUIZZES: (user) => user.QuizAttempt.length >= 10,
  LEVEL_UP: (user) => user.role !== 'INICIANTE',
  FIRST_ANSWER: (user) => user.Answer.length > 0,
  FIRST_QUIZ: (user) => user.Quiz.length > 0,
  REACH_MAX_LEAGUE: (user) => user.league === 'Diamante',
};

const checkAndAwardAchievements = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserAchievements: true,
      Answer: true,
      Question: true,
      Quiz: true,
      QuizAttempt: true,
    },
  });

  const achievements = await prisma.achievement.findMany();

  const achievementsToAward = achievements.filter((achievement) => {
    const hasAchievement = user.UserAchievements.some((ua) => ua.achievementId === achievement.id);
    const conditionMet = achievementConditions[achievement.condition]?.(user) ?? false;

    return !hasAchievement && conditionMet;
  });

  if (achievementsToAward.length > 0) {
    await prisma.userAchievements.createMany({
      data: achievementsToAward.map((achievement) => ({
        userId: user.id,
        achievementId: achievement.id,
      })),
    });

    const notificationPromises = achievementsToAward.map((achievement) =>
      createNotification(userId, `Você recebeu a conquista "${achievement.title}"`, 'achievement-received', '/profile'),
    );

    const notifications = await Promise.all(notificationPromises);

    const resourceOwnerSocket = getUserSocket(userId);
    if (resourceOwnerSocket) {
      notifications.forEach((notification) => {
        resourceOwnerSocket.emit('newNotification', notification);
      });
    } else {
      console.log(`Socket não encontrado para o usuário ${userId}`);
    }
  }

  return achievementsToAward;
};

const getAvailableAchievements = async (userId) => {
  const userAchievements = await prisma.userAchievements.findMany({
    where: { userId },
    select: { achievementId: true },
  });

  const userAchievementIds = userAchievements.map((ua) => ua.achievementId);

  return prisma.achievement.findMany({
    where: {
      id: { notIn: userAchievementIds },
    },
  });
};

const getUserAchievements = async (userId) => {
  return prisma.userAchievements.findMany({
    where: { userId },
    include: { achievement: true },
  });
};

const getAllAchievements = async () => {
  return prisma.achievement.findMany();
};

module.exports = {
  checkAndAwardAchievements,
  getAvailableAchievements,
  getUserAchievements,
  getAllAchievements,
};
