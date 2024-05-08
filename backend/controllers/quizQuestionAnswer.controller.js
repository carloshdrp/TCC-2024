const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { quizQuestionAnswerService } = require('../services');
const { pick } = require('../utils');

const createQuizQuestionAnswer = catchAsync(async (req, res) => {
  const { questionId } = req.query;
  const userId = req.user.id;
  const quizQuestionAnswer = await quizQuestionAnswerService.createQuizQuestionAnswer(req.body, questionId, userId);
  res.status(httpStatus.CREATED).send(quizQuestionAnswer);
});

const getQuizQuestionAnswers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['questionId', 'userId', 'choice']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizQuestionAnswerService.listQuizQuestionAnswer(filter, options);
  res.status(httpStatus.OK).send(result);
});

const deleteQuizQuestionAnswer = catchAsync(async (req, res) => {
  const { quizQuestionAnswerId } = req.params;
  const { id: userId } = req.user;
  console.log(userId);
  await quizQuestionAnswerService.deleteQuizQuestionAnswer(quizQuestionAnswerId, userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createQuizQuestionAnswer,
  getQuizQuestionAnswers,
  deleteQuizQuestionAnswer,
};
