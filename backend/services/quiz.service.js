const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createQuiz = async (quizBody, authorId) => {
  const quiz = await prisma.quiz.create({
    data: {
      ...quizBody,
      user: {
        connect: { id: authorId },
      },
    },
  });

  return quiz;
};

const queryQuizzes = async (filter, options) => {
  const quizzes = await prisma.quiz.findMany({
    where: {
      title: {
        contains: filter.title,
        mode: 'insensitive',
      },
      user: {
        id: filter.userId,
      },
      difficulty: {
        equals: filter.difficulty,
      },
    },
    take: options.limit,
    skip: options.skip,
    orderBy: { createdAt: options.sortBy },
    include: {
      Question: true,
      user: true,
    },
  });

  return quizzes;
};

const getQuizById = async (quizId) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      Question: true,
      user: true,
    },
  });

  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz não encontrado');
  }

  return quiz;
};

const updateQuizById = async (userId, quizId, updateBody) => {
  const quiz = await getQuizById(quizId);
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user || quiz.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para atualizar este quiz');
  }

  return prisma.quiz.update({
    where: { id: quizId },
    data: updateBody,
  });
};

const deleteQuizById = async (quizId, userId) => {
  const quiz = await getQuizById(quizId);

  if (quiz.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para deletar este quiz');
  }

  await prisma.quiz.delete({
    where: { id: quizId },
  });
};

module.exports = {
  createQuiz,
  queryQuizzes,
  getQuizById,
  updateQuizById,
  deleteQuizById,
};