/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');
const { recalculateUserLeague } = require('./badges.service');

const createQuestion = async (questionBody, authorId) => {
  return prisma.question.create({
    data: {
      ...questionBody,
      user: {
        connect: { id: authorId },
      },
    },
  });
};

const queryQuestions = async (filter, options) => {
  return prisma.question.findMany({
    where: {
      title: {
        contains: filter.title,
      },
      tag: filter.tagName,
      user: {
        id: filter.userId,
      },
    },
    take: options.limit,
    skip: options.skip,
    orderBy: { createdAt: options.sortBy },
    include: {
      Answer: true,
      user: true,
    },
  });
};

const getQuestionById = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      Answer: true,
      user: true,
    },
  });

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pergunta não encontrada');
  }

  return question;
};

const updateQuestionById = async (userId, questionId, updateBody) => {
  const question = await getQuestionById(questionId);
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (question.locked && user.role !== 'ADMIN') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Esta pergunta já foi respondida e não pode ser modificada.');
  }

  return prisma.question.update({
    where: { id: questionId },
    data: updateBody,
  });
};

const deleteQuestionById = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { userId: true },
  });

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pergunta não encontrada');
  }

  await prisma.$transaction([
    prisma.answer.deleteMany({ where: { questionId } }),
    prisma.rating.deleteMany({ where: { rateableId: questionId } }),
    prisma.question.delete({ where: { id: questionId } }),
  ]);

  await recalculateUserLeague(question.userId);
};

module.exports = {
  createQuestion,
  queryQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
