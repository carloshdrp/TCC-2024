const { prisma } = require('../config/database');
const { checkAndAwardAchievements } = require('./achievement.service');

const incrementPoints = async (userId, amount) => {
  const points = await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: amount } },
  });

  await checkAndAwardAchievements(userId);

  return points;
};

const decrementPoints = async (userId, amount) => {
  return prisma.user.update({
    where: { id: userId },
    data: { points: { decrement: amount } },
  });
};

module.exports = {
  incrementPoints,
  decrementPoints,
};
