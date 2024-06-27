/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

async function rateableTypeValidator(rateableType, rateableId) {
  switch (rateableType) {
    case 'QUESTION': {
      const question = await prisma.question.findUnique({
        where: { id: rateableId },
      });

      if (!question) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Pergunta não encontrada');
      }
      break;
    }
    case 'ANSWER': {
      const answer = await prisma.answer.findUnique({
        where: { id: rateableId },
      });

      if (!answer) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Resposta não encontrada');
      }
      break;
    }
    case 'QUIZ': {
      const quiz = await prisma.quiz.findUnique({
        where: { id: rateableId },
      });

      if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Quiz não encontrado');
      }
      break;
    }
    default: {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tipo de avaliação inválido');
    }
  }
}

async function userValidator(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Usuário não encontrado');
  }
}

const createRating = async (userId, rateableId, rateableType) => {
  await userValidator(userId);
  await rateableTypeValidator(rateableType, rateableId);

  return prisma.rating.create({
    data: {
      ratedBy: {
        connect: { id: userId },
      },
      rateableId,
      rateableType,
    },
  });
};

const queryRatings = async (filter, options) => {
  return await prisma.rating.findMany({
    where: {
      rateableId: filter.rateableId,
      rateableType: filter.rateableType,
    },
    take: options.limit,
    skip: options.skip,
    orderBy: { createdAt: options.sortBy },
    include: {
      ratedBy: true,
    },
  });
};

const getRatingById = async (ratingId) => {
  const rating = await prisma.rating.findUnique({
    where: { id: ratingId },
    include: {
      ratedBy: true,
    },
  });

  if (!rating) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Avaliação não encontrada');
  }

  return rating;
};

const getRatingByUserId = async (userId, rateableId) => {
  return await prisma.rating.findMany({
    where: {
      ratedBy: { id: userId },
      rateableId,
    },
  });
};

const getRatingByRateableId = async (rateableId) => {
  return await prisma.rating.findMany({
    where: {
      rateableId,
    },
  });
};

const getRatingByRateableType = async (rateableType) => {
  return await prisma.rating.findMany({
    where: {
      rateableType,
    },
  });
};

const getUserReceivedRatings = async (userId) => {
  await userValidator(userId);

  const [questionRatingsCount, answerRatingsCount, quizRatingsCount] = await Promise.all([
    prisma.rating.count({
      where: {
        rateableType: 'QUESTION',
        rateableId: {
          in: await prisma.question
            .findMany({
              where: { userId },
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
              where: { userId },
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
              where: { userId },
              select: { id: true },
            })
            .then((quizzes) => quizzes.map((q) => q.id)),
        },
      },
    }),
  ]);

  return questionRatingsCount + answerRatingsCount + quizRatingsCount;
};

const deleteRatingById = async (userId, ratingId) => {
  const rating = await getRatingById(ratingId);

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para realizar esta ação!');
  } else if (rating.ratedBy.id !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para realizar esta ação!');
  }

  return prisma.rating.delete({
    where: { id: ratingId },
  });
};

module.exports = {
  createRating,
  queryRatings,
  getRatingById,
  getRatingByUserId,
  getRatingByRateableId,
  getRatingByRateableType,
  getUserReceivedRatings,
  deleteRatingById,
};
