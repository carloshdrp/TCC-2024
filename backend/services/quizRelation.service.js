const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createQuizRelation = async (quizRelationBody, authorId) => {
  const quizRelation = await prisma.quizRelation.create({
    data: {
      ...quizRelationBody.completed, // completed, quizId
      user: {
        connect: { id: authorId },
      },
      quiz: {
        connect: { id: quizRelationBody.quizId },
      },
    },
  });

  return quizRelation;
};

const queryQuizRelations = async (filter, options) => {
  const quizRelations = await prisma.quizRelation.findMany({
    where: {
      completed: filter.completed,
      quizId: filter.quizId,
      userId: filter.userId,
    },
    take: options.limit,
    skip: options.skip,
    orderBy: { createdAt: options.sortBy },
    include: {
      user: true,
      quiz: true,
    },
  });

  return quizRelations;
};

const getQuizRelationById = async (quizRelationId) => {
  const quizRelation = await prisma.quizRelation.findUnique({
    where: { id: quizRelationId },
    include: {
      user: true,
      quiz: true,
    },
  });

  if (!quizRelation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Relação não encontrada');
  }

  return quizRelation;
};

const updateQuizRelationById = async (userId, quizRelationId, updateBody) => {
  const quizRelation = await prisma.quizRelation.findFirst({
    where: {
      id: quizRelationId,
      userId,
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!quizRelation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Relação não encontrada');
  }

  if (!user || quizRelation.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para realizar esta ação.');
  }

  return prisma.quizRelation.update({
    where: { id: quizRelationId },
    data: updateBody,
  });
};

const deleteQuizRelationById = async (userId, quizRelationId) => {
  const quizRelation = await prisma.quizRelation.findFirst({
    where: {
      id: quizRelationId,
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!quizRelation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Relação não encontrada');
  }

  if (!user || quizRelation.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para realizar esta ação.');
  }

  await prisma.quizRelation.delete({
    where: { id: quizRelationId },
  });
};

const deleteQuizRelation = async (userId, quizId) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!quizId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Relação não encontrada');
  }

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para realizar esta ação.');
  }

  await prisma.quizRelation.deleteMany({
    where: {
      quizId,
    },
  });
};

module.exports = {
  createQuizRelation,
  queryQuizRelations,
  getQuizRelationById,
  updateQuizRelationById,
  deleteQuizRelationById,
  deleteQuizRelation,
};
