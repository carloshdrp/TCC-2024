/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createQuizAttempt = async (quizAttemptBody, quizId, userId) => {
  return prisma.quizAttempt.create({
    data: {
      ...quizAttemptBody,
      quiz: {
        connect: { id: quizId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
};

const queryQuizAttempts = async (filter, options) => {
  return prisma.quizAttempt.findMany({
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
      QuizQuestionAnswer: true,
    },
  });
};

const getQuizScore = async (quizId) => {
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { quizId },
  });

  if (quizAttempts.length === 0) {
    return null; // ou qualquer valor padrão
  }

  const scores = quizAttempts.map((attempt) => attempt.score);

  const sum = scores.reduce((a, b) => a + b, 0);

  return sum / scores.length;
};

const deleteQuizAttempt = async (quizAttemptId, user) => {
  const quizAttempt = await prisma.quizAttempt.findFirst({
    where: { id: quizAttemptId },
  });

  if (user.role !== 'admin' && user.id !== quizAttempt.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem acesso à este recurso.');
  }

  return prisma.quizAttempt.delete({
    where: { id: quizAttemptId },
  });
};

module.exports = {
  createQuizAttempt,
  getQuizScore,
  queryQuizAttempts,
  deleteQuizAttempt,
};
