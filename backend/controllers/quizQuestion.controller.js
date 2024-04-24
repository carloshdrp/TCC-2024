const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { quizQuestionService } = require('../services');
const { pick } = require('../utils');

const createQuizQuestion = catchAsync(async (req, res) => {
  const { quizId } = req.query;
  const quizQuestion = await quizQuestionService.createQuizQuestion(req.body, quizId);
  res.status(httpStatus.CREATED).send(quizQuestion);
});

const getQuizQuestions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['quizId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizQuestionService.queryQuizQuestions(filter, options);
  res.send(result);
});

const getQuizQuestion = catchAsync(async (req, res) => {
  const quizQuestion = await quizQuestionService.getQuizQuestionById(req.params.quizQuestionId);
  res.send(quizQuestion);
});

const updateQuizQuestion = catchAsync(async (req, res) => {
  const { quizId, quizQuestionId } = req.query;
  const userId = req.user.id;
  const quizQuestion = await quizQuestionService.updateQuizQuestionById(quizId, userId, quizQuestionId, req.body);
  res.send(quizQuestion);
});

const deleteQuizQuestion = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { quizId, quizQuestionId } = req.query;
  await quizQuestionService.deleteQuizQuestionById(quizId, quizQuestionId, userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createQuizQuestion,
  getQuizQuestion,
  getQuizQuestions,
  updateQuizQuestion,
  deleteQuizQuestion,
};
