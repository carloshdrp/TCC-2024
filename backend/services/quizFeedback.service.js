/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createQuizFeedback = async (quizFeedbackBody, quizId, userId) => {
  return prisma.quizDifficultyFeedback.create({
    data: {
      ...quizFeedbackBody,
      quiz: {
        connect: { id: quizId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
};

const queryQuizFeedbacks = async (filter, options) => {
  return prisma.quizDifficultyFeedback.findMany({
    where: {
      quizId: filter.quizId,
      userId: filter.userId,
      score: filter.score,
    },
    take: options.limit,
    skip: options.skip,
    orderBy: { createdAt: options.sortBy },
    include: {
      quiz: true,
      user: true,
    },
  });
};

const deleteQuizFeedback = async (quizFeedbackId, user) => {
  const quizFeedback = await prisma.quizDifficultyFeedback.findFirst({
    where: { id: quizFeedbackId },
  });

  if (user.role !== 'admin' && user.id !== quizFeedback.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem acesso a este recurso.');
  }

  return prisma.quizDifficultyFeedback.delete({
    where: { id: quizFeedbackId },
  });
};

module.exports = {
  createQuizFeedback,
  queryQuizFeedbacks,
  deleteQuizFeedback,
};
