/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createQuizQuestion = async (quizQuestionBody, quizId) => {
  return await prisma.quizQuestion.create({
    data: {
      ...quizQuestionBody,
      quiz: {
        connect: { id: quizId },
      },
    },
  });
};

const queryQuizQuestions = async (filter, options) => {
  return await prisma.quizQuestion.findMany({
    where: {
      quizId: filter.quizId,
    },
    take: options.limit,
    skip: options.skip,
    orderBy: { createdAt: options.sortBy },
    include: {
      quiz: true,
    },
  });
};

const getQuizQuestionById = async (quizQuestionId) => {
  const quizQuestion = await prisma.quizQuestion.findUnique({
    where: { id: quizQuestionId },
    include: {
      quiz: true,
    },
  });

  if (!quizQuestion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Questão de quiz não encontrada');
  }

  return quizQuestion;
};

const updateQuizQuestionById = async (quizId, userId, quizQuestionId, updateBody) => {
  const quizQuestion = await prisma.quizQuestion.findFirst({
    where: { id: quizQuestionId },
  });
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId },
    include: { Question: true },
  });

  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz não encontrado');
  }

  if (!user || quiz.userId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para atualizar essa questão do quiz');
  }

  await Promise.all(
    quiz.Question.map(async (question) => {
      if (question.id === quizQuestionId) {
        if (String(quiz.userId) !== String(userId)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para atualizar essa questão do quiz');
        }
      }
    }),
  );

  return prisma.quizQuestion.update({
    where: { id: quizQuestionId },
    data: updateBody,
  });
};

const deleteQuizQuestionById = async (quizId, quizQuestionId, userId) => {
  const quizQuestion = await prisma.quizQuestion.findFirst({
    where: { id: quizQuestionId },
  });
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId },
    include: { Question: true },
  });

  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz não encontrado');
  }

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para deletar essa questão do quiz');
  }

  await Promise.all(
    quiz.Question.map(async (question) => {
      if (question.id === quizQuestionId) {
        if (String(quiz.userId) !== String(userId)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para deletar essa questão do quiz');
        }
      }
    }),
  );

  return prisma.quizQuestion.delete({
    where: { id: quizQuestionId },
  });
};

module.exports = {
  createQuizQuestion,
  queryQuizQuestions,
  getQuizQuestionById,
  updateQuizQuestionById,
  deleteQuizQuestionById,
};
