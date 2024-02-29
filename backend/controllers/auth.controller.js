const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const { tokenTypes } = require('../config/token');

const register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new Error('"email", "password", and "name" are required');
  }

  if (req.file) {
    req.body.avatar = req.file.path;
  }

  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const verifyToken = catchAsync(async (req, res) => {
  const { token } = req.body;

  try {
    await tokenService.verifyToken(token, tokenTypes.ACCESS);
    res.status(httpStatus.OK).send({ valid: true });
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).send({ valid: false, message: error.message });
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  verifyToken,
};
