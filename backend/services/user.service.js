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
  const users = await prisma.user.findMany({
    where: filter,
    skip: options.skip,
    take: options.limit,
    orderBy: options.sort,
  });

  return users;
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
  if (updateBody.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: updateBody.email },
    });

    if (emailExists && emailExists.id !== userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateBody,
  });
};

const deleteUserById = async (userId) => {
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

  const userRanking = usersWithTotal.findIndex((user) => user.id === userId) + 1;

  return userRanking;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getRanking,
};
