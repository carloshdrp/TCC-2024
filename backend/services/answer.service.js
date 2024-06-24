/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createAnswer = async (answerBody, userId, questionId) => {
  const answer = await prisma.answer.create({
    data: {
      ...answerBody,
      user: {
        connect: { id: userId },
      },
      question: {
        connect: { id: questionId },
      },
    },
  });

  return answer;
};

const queryAnswers = async (filter, options) => {
  const answers = await prisma.answer.findMany({
    where: filter,
    take: options.limit,
    skip: options.skip,
    orderBy: options.sort,
    include: {
      user: true,
      question: true,
    },
  });

  return answers;
};

const getAnswerById = async (answerId) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: {
      user: true,
      question: true,
    },
  });

  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resposta não encontrada');
  }

  return answer;
};

const getAnswersByQuestionId = async (questionId) => {
  const answers = await prisma.answer.findMany({
    where: { questionId },
    include: {
      user: true,
      question: true,
    },
  });

  return answers;
};

const updateAnswerById = async (answerId, updateBody, userId) => {
  const answer = await getAnswerById(answerId);

  if (answer.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para acessar este recurso!');
  }

  return prisma.answer.update({
    where: { id: answerId },
    data: updateBody,
  });
};

const deleteAnswerById = async (answerId) => {
  const ratings = await prisma.rating.findMany({
    where: { rateableId: answerId },
  });
  if (ratings.length > 0) {
    await prisma.rating.deleteMany({
      where: { rateableId: answerId },
    });
  }

  return prisma.answer.delete({
    where: { id: answerId },
  });
};

module.exports = {
  createAnswer,
  queryAnswers,
  getAnswerById,
  getAnswersByQuestionId,
  updateAnswerById,
  deleteAnswerById,
};
