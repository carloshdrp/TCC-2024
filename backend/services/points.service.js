const { prisma } = require('../config/database');

const incrementPoints = async (userId, amount) => {
  return prisma.user.update({
    where: { id: userId },
    data: { points: { increment: amount } },
  });
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
