const { prisma } = require('../config/database');
const { badgeService } = require('../services');

async function getResourceOwnerId(rateableType, rateableId) {
  switch (rateableType) {
    case 'QUESTION':
      return prisma.question.findUnique({ where: { id: rateableId } }).then((q) => q?.userId);
    case 'ANSWER':
      return prisma.answer.findUnique({ where: { id: rateableId } }).then((a) => a?.userId);
    case 'QUIZ':
      return prisma.quiz.findUnique({ where: { id: rateableId } }).then((q) => q?.userId);
    default:
      return null;
  }
}

const leagueChecker = () => async (req, res, next) => {
  try {
    let rateableType;
    let rateableId;

    if (req.method === 'POST') {
      ({ rateableType, rateableId } = req.body);
    } else if (req.method === 'DELETE') {
      const rating = await prisma.rating.findUnique({
        where: { id: req.params.ratingId },
        select: { rateableType: true, rateableId: true },
      });

      if (!rating) {
        return res.status(404).json({ message: 'Rating não encontrado' });
      }

      ({ rateableType, rateableId } = rating);
    } else {
      return next();
    }

    const resourceOwnerId = await getResourceOwnerId(rateableType, rateableId);

    if (!resourceOwnerId) {
      return res.status(404).json({ message: 'Recurso não encontrado' });
    }

    const beforeProgress = await badgeService.badgeProgress(resourceOwnerId);

    res.locals.ratingInfo = {
      resourceOwnerId,
      rateableType,
      rateableId,
      beforeProgress,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = leagueChecker;
