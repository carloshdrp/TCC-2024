const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { quizFeedbackService } = require('../services');
const { pick } = require('../utils');

const createQuizFeedback = catchAsync(async (req, res) => {
  const { quizId } = req.query;
  const { id: userId } = req.user;
  const quizFeedback = await quizFeedbackService.createQuizFeedback(req.body, quizId, userId);
  res.status(httpStatus.CREATED).send(quizFeedback);
});

const getQuizFeedbacks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['quizId', 'userId', 'score']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizFeedbackService.queryQuizFeedbacks(filter, options);
  res.send(result);
});

const deleteQuizFeedback = catchAsync(async (req, res) => {
  const { quizFeedbackId } = req.params;
  const { user } = req;

  await quizFeedbackService.deleteQuizFeedback(quizFeedbackId, user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createQuizFeedback,
  getQuizFeedbacks,
  deleteQuizFeedback,
};
