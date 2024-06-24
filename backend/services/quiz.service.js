const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');
const { recalculateUserLeague } = require('./badges.service');

const createQuiz = async (quizBody, authorId) => {
  return prisma.quiz.create({
    data: {
      ...quizBody,
      user: {
        connect: { id: authorId },
      },
    },
  });
};

const queryQuizzes = async (filter, options) => {
  return prisma.quiz.findMany({
    where: {
      title: {
        contains: filter.title,
        mode: 'insensitive',
      },
      subject: {
        equals: filter.subject,
      },
      user: {
        id: filter.userId,
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

const deleteQuizById = async (quizId) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { userId: true },
  });

  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz não encontrado');
  }

  await prisma.$transaction([
    prisma.quizQuestionAnswer.deleteMany({
      where: { quizQuestion: { quizId } },
    }),
    prisma.quizAttempt.deleteMany({ where: { quizId } }),
    prisma.quizRelation.deleteMany({ where: { quizId } }),
    prisma.rating.deleteMany({ where: { rateableId: quizId } }),
    prisma.report.deleteMany({ where: { reportableId: quizId } }),
    prisma.quizQuestion.deleteMany({ where: { quizId } }),
    prisma.quiz.delete({ where: { id: quizId } }),
  ]);

  await recalculateUserLeague(quiz.userId);
};

module.exports = {
  createQuiz,
  queryQuizzes,
  getQuizById,
  updateQuizById,
  deleteQuizById,
};
