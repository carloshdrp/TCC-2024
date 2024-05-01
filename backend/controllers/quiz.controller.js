const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { quizService } = require('../services');
const { pick, ApiError } = require('../utils');

const createQuiz = catchAsync(async (req, res) => {
  const authorId = req.user.id;
  const quiz = await quizService.createQuiz(req.body, authorId);
  res.status(httpStatus.CREATED).send(quiz);
});

const getQuizzes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'subject', 'userId', 'difficulty']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizService.queryQuizzes(filter, options);
  res.send(result);
});

const getQuiz = catchAsync(async (req, res) => {
  const quiz = await quizService.getQuizById(req.params.quizId);
  res.send(quiz);
});

const updateQuiz = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const quiz = await quizService.updateQuizById(userId, req.params.quizId, req.body);
  res.send(quiz);
});

const deleteQuiz = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await quizService.deleteQuizById(req.params.quizId, userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const attachQuiz = catchAsync(async (req, res, next) => {
  const quiz = await quizService.getQuizById(req.params.quizId);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz não encontrado');
  }
  req.quiz = quiz;
  req.resourceOwnerId = quiz.userId;
  return next();
});

module.exports = {
  createQuiz,
  getQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
  attachQuiz,
};
