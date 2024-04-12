/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createQuestion = async (questionBody, authorId, tagId) => {
  const question = await prisma.question.create({
    data: {
      ...questionBody,
      user: {
        connect: { id: authorId },
      },
      tag: {
        connect: { id: tagId },
      },
    },
  });

  return question;
};

const queryQuestions = async (filter, options) => {
  const questions = await prisma.question.findMany({
    where: {
      title: {
        contains: filter.title,
      },
      tag: { name: filter.tagName },
    },
    take: options.limit,
    skip: options.skip,
    orderBy: options.sort,
    include: {
      Answer: true,
      tag: true,
      user: true,
    },
  });

  return questions;
};

const getQuestionById = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      Answer: true,
    },
  });

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pergunta não encontrada');
  }

  return question;
};

const updateQuestionById = async (userId, questionId, updateBody) => {
  const question = await getQuestionById(questionId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para acessar este recurso!');
  }

  if (question.locked && user.role !== 'ADMIN') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Esta pergunta já foi respondida e não pode ser modificada.');
  }

  return prisma.question.update({
    where: { id: questionId },
    data: updateBody,
  });
};

const deleteQuestionById = async (questionId) => {
  const question = await getQuestionById(questionId);

  return prisma.question.delete({
    where: { id: questionId },
  });
};

module.exports = {
  createQuestion,
  queryQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
