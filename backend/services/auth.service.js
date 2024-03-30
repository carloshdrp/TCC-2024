const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const { ApiError, isPasswordMatch } = require('../utils');
const { tokenTypes } = require('../config/token');
const { prisma } = require('../config/database');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await isPasswordMatch(user, password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email ou senha incorretos');
  }
  return user;
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: 'REFRESH',
      blackListed: false,
    },
  });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Não encontrado.');
  }

  await prisma.token.delete({
    where: {
      id: refreshTokenDoc.id,
    },
  });
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.userId);
    if (!user) {
      throw new Error();
    }
    await prisma.token.delete({
      where: {
        id: refreshTokenDoc.id,
      },
    });

    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Não autorizado');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
};
