const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { pointsService, userService } = require('../services');
const { ApiError } = require('../utils');

const incrementPoints = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  const points = await pointsService.incrementPoints(userId, amount);
  res.send(points);
});

const decrementPoints = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  const user = await userService.getUserById(userId);

  if (user.points < amount || user.points === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Usuário não tem pontos suficientes');
  }

  const points = await pointsService.decrementPoints(userId, amount);
  res.send(points);
});

const attachUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Usuário não encontrado');
  }
  req.user = user;
  req.resourceOwnerId = user.id;
  return next();
});

module.exports = {
  incrementPoints,
  decrementPoints,
  attachUser,
};
