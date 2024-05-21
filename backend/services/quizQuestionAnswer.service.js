/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createQuizQuestionAnswer = async (quizQuestionAnswerBody, questionId, attemptId, userId) => {
  return prisma.quizQuestionAnswer.create({
    data: {
      ...quizQuestionAnswerBody,
      quizQuestion: {
        connect: { id: questionId },
      },
      quizAttempt: {
        connect: { id: attemptId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
};

const deleteQuizQuestionAnswer = async (quizQuestionAnswerId, userId) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  const quizQuestionAnswer = await prisma.quizQuestionAnswer.findFirst({
    where: { id: quizQuestionAnswerId },
  });

  if (!quizQuestionAnswer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resposta de questão de quiz não encontrada');
  }

  if (user.role !== 'ADMIN' && quizQuestionAnswer.userId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Você não tem permissão para acessar este recurso!');
  }

  return prisma.quizQuestionAnswer.delete({
    where: { id: quizQuestionAnswerId },
  });
};

const listQuizQuestionAnswer = async (filter, options) => {
  return prisma.quizQuestionAnswer.findMany({
    where: {
      quizQuestionId: filter.quizQuestionId,
      userId: filter.userId,
      choice: filter.choice,
      quizAttemptId: filter.attemptId,
    },
    take: options.limit,
    skip: options.skip,
    orderBy: { createdAt: options.sortBy },
    include: {
      user: true,
      quizQuestion: true,
    },
  });
};

module.exports = {
  createQuizQuestionAnswer,
  deleteQuizQuestionAnswer,
  listQuizQuestionAnswer,
};
