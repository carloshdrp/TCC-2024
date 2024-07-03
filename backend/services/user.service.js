const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { ApiError } = require('../utils');

const createUser = async (userBody) => {
  const emailExists = await prisma.user.findUnique({
    where: { email: userBody.email },
  });

  if (emailExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email em uso');
  }

  const hashedPassword = await bcrypt.hash(userBody.password, 10);

  return prisma.user.create({
    data: {
      ...userBody,
      password: hashedPassword,
    },
  });
};

const queryUsers = async (filter, options) => {
  return prisma.user.findMany({
    where: filter,
    skip: options.skip,
    take: options.limit,
    orderBy: options.sort,
  });
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const updateUserById = async (userId, updateBody) => {
  const updateData = { ...updateBody };

  if (updateData.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: updateData.email },
    });

    if (emailExists && emailExists.id !== userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Este email já está em uso!');
    }
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};

const deleteUserById = async (userId) => {
  const tokens = await prisma.token.findMany({
    where: { userId },
  });
  if (tokens.length > 0) {
    await prisma.token.deleteMany({
      where: { userId },
    });
  }

  const achievements = await prisma.userAchievements.findMany({
    where: { userId },
  });
  if (achievements.length > 0) {
    await prisma.userAchievements.deleteMany({
      where: { userId },
    });
  }

  const answer = await prisma.answer.findMany({
    where: { userId },
  });
  if (answer.length > 0) {
    await prisma.answer.deleteMany({
      where: { userId },
    });
  }

  const questions = await prisma.question.findMany({
    where: { userId },
    include: {
      Answer: true,
    },
  });

  if (questions.length > 0) {
    await Promise.all(
      questions.map(async (question) => {
        if (question.Answer.length > 0) {
          await prisma.answer.deleteMany({
            where: { questionId: question.id },
          });
        }
      }),
    );

    await prisma.question.deleteMany({
      where: { userId },
    });
  }

  const report = await prisma.report.findMany({
    where: { userId },
  });
  if (report.length > 0) {
    await prisma.report.deleteMany({
      where: { userId },
    });
  }

  const rating = await prisma.rating.findMany({
    where: { userId },
  });
  if (rating.length > 0) {
    await prisma.rating.deleteMany({
      where: { userId },
    });
  }

  const quizRelation = await prisma.quizRelation.findMany({
    where: { userId },
  });
  if (quizRelation.length > 0) {
    await prisma.quizRelation.deleteMany({
      where: { userId },
    });
  }

  const quizQuestionAnswer = await prisma.quizQuestionAnswer.findMany({
    where: { userId },
  });
  if (quizQuestionAnswer.length > 0) {
    await prisma.quizQuestionAnswer.deleteMany({
      where: { userId },
    });
  }

  const quizAttempt = await prisma.quizAttempt.findMany({
    where: { userId },
  });
  if (quizAttempt.length > 0) {
    await prisma.quizAttempt.deleteMany({
      where: { userId },
    });
  }

  const quiz = await prisma.quiz.findMany({
    where: { userId },
  });
  if (quiz.length > 0) {
    await prisma.quiz.deleteMany({
      where: { userId },
    });
  }

  await prisma.user.delete({
    where: { id: userId },
  });
};

const getRanking = async (userId) => {
  const users = await prisma.user.findMany({
    include: {
      Answer: {},
      Quiz: {},
    },
  });

  const usersWithTotal = users.map((user) => ({
    ...user,
    total: user.Answer.length + user.Quiz.length,
  }));

  usersWithTotal.sort((a, b) => b.total - a.total);

  return usersWithTotal.findIndex((user) => user.id === userId) + 1;
};

const getLeague = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { league: true },
  });
};

const getUserCount = async () => {
  return prisma.user.count();
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getRanking,
  getLeague,
  getUserCount,
};
