const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getRanking = async (req, res) => {
  try {
    const { userId } = req.params;
    const ranking = await userService.getRanking(userId);
    res.status(200).json({ ranking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = catchAsync(async (req, res) => {
  if (req.params.userId !== undefined) {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getLeague = catchAsync(async (req, res) => {
  const league = await userService.getLeague(req.params.userId);
  res.send(league);
});

const attachUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Usuário não encontrado');
  }
  req.user = user;
  req.resourceOwnerId = user.id;
  next();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getRanking,
  updateUser,
  deleteUser,
  getLeague,
  attachUser,
};
