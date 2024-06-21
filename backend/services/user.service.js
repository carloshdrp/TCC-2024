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
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    updateData.password = hashedPassword;
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
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

const getLeague = async (userId) => {
  const league = await prisma.user.findUnique({
    where: { id: userId },
    select: { league: true },
  });

  return league;
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
