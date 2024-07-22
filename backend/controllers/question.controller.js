const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { questionService } = require('../services');
const { pick, ApiError } = require('../utils');
const { checkAndAwardAchievements } = require('../services/achievement.service');

const createQuestion = catchAsync(async (req, res) => {
  const authorId = req.user.id;
  const { tagId, ...questionBody } = req.body;
  const question = await questionService.createQuestion(questionBody, authorId, tagId);
  await checkAndAwardAchievements(authorId);

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
  const { tags, ...updateBody } = req.body;
  const { userId } = req.user;
  const question = await questionService.updateQuestionById(userId, req.params.questionId, updateBody, tags);
  res.send(question);
});

const deleteQuestion = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await questionService.deleteQuestionById(req.params.questionId, userId);
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
