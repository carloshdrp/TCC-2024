const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { quizAttemptService } = require('../services');
const { pick } = require('../utils');

const createQuizAttempt = catchAsync(async (req, res) => {
  const { quizId } = req.query;
  const { id: userId } = req.user;
  const quizAttempt = await quizAttemptService.createQuizAttempt(req.body, quizId, userId);
  res.status(httpStatus.CREATED).send(quizAttempt);
});

const getQuizScore = catchAsync(async (req, res) => {
  const { quizId } = req.params;
  const score = await quizAttemptService.getQuizScore(quizId);
  res.send({ score });
});

const getQuizAttempts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['quizId', 'userId', 'score']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizAttemptService.queryQuizAttempts(filter, options);
  res.send(result);
});

const getQuizAttemptById = catchAsync(async (req, res) => {
  const { quizAttemptId } = req.params;
  const quizAttempt = await quizAttemptService.getQuizAttemptById(quizAttemptId);
  res.send(quizAttempt);
});

const deleteQuizAttempt = catchAsync(async (req, res) => {
  const { quizAttemptId } = req.params;
  const { user } = req;

  await quizAttemptService.deleteQuizAttempt(quizAttemptId, user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createQuizAttempt,
  getQuizScore,
  getQuizAttempts,
  getQuizAttemptById,
  deleteQuizAttempt,
};
