const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const createQuestion = async (questionBody, authorId, tags) => {
  const question = await prisma.question.create({
    data: {
      ...questionBody,
      user: {
        connect: { id: authorId },
      },
    },
  });
  if (Array.isArray(tags)) {
    await Promise.all(
      tags.map((tagId) =>
        prisma.questionTags.create({
          data: {
            questionId: question.id,
            tagId,
          },
        }),
      ),
    );
  }

  return question;
};

const queryQuestions = async (filter, options) => {
  const questions = await prisma.question.findMany({
    where: filter,
    take: options.limit,
    skip: options.skip,
    orderBy: options.sort,
    include: {
      Answer: true,
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

const updateQuestionById = async (userId, questionId, updateBody, newTags) => {
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

  await prisma.questionTags.deleteMany({
    where: { questionId },
  });

  if (Array.isArray(newTags)) {
    await Promise.all(
      newTags.map((tagId) =>
        prisma.questionTags.create({
          data: {
            questionId: question.id,
            tagId,
          },
        }),
      ),
    );
  }

  return prisma.question.update({
    where: { id: questionId },
    data: updateBody,
  });
};

const deleteQuestionById = async (questionId) => {
  await getQuestionById(questionId);

  await prisma.questionTags.deleteMany({
    where: { questionId },
  });

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
