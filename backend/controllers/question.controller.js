const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { questionService } = require('../services');
const { pick, ApiError } = require('../utils');

const createQuestion = catchAsync(async (req, res) => {
  const authorId = req.user.id;
  const { tagId, ...questionBody } = req.body;
  const question = await questionService.createQuestion(questionBody, authorId, tagId);
  res.status(httpStatus.CREATED).send(question);
});

const getQuestions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'tagName', 'userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await questionService.queryQuestions(filter, options);
  res.send(result);
});

const getQuestion = catchAsync(async (req, res) => {
  const question = await questionService.getQuestionById(req.params.questionId);
  res.send(question);
});

const updateQuestion = catchAsync(async (req, res) => {
  const { userId, tags, ...updateBody } = req.body;
  const question = await questionService.updateQuestionById(userId, req.params.questionId, updateBody, tags);
  res.send(question);
});

const deleteQuestion = catchAsync(async (req, res) => {
  await questionService.deleteQuestionById(req.params.questionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const attachQuestion = catchAsync(async (req, res, next) => {
  const question = await questionService.getQuestionById(req.params.questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pergunta não encontrada');
  }
  req.question = question;
  req.resourceOwnerId = question.userId;
  return next();
});

module.exports = {
  createQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  attachQuestion,
};