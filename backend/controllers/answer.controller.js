const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { answerService, questionService } = require('../services');
const { pick, ApiError } = require('../utils');

const createAnswer = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { questionId, ...answerBody } = req.body;

  const question = await questionService.getQuestionById(questionId);
  if (question.userId === userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não pode responder a sua própria pergunta');
  }

  try {
    const answer = await answerService.createAnswer(answerBody, userId, questionId);
    res.status(httpStatus.CREATED).send(answer);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const getAnswers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['content', 'userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  try {
    const result = await answerService.queryAnswers(filter, options);
    res.send(result);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const getAnswer = catchAsync(async (req, res) => {
  try {
    const answer = await answerService.getAnswerById(req.params.answerId);
    res.send(answer);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const getAnswersByQuestionId = catchAsync(async (req, res) => {
  try {
    const answers = await answerService.getAnswersByQuestionId(req.params.questionId);
    res.send(answers);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const updateAnswer = catchAsync(async (req, res) => {
  try {
    const userId = req.user.id;
    const answer = await answerService.updateAnswerById(req.params.answerId, req.body, userId);
    res.send(answer);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

const deleteAnswer = catchAsync(async (req, res) => {
  try {
    await answerService.deleteAnswerById(req.params.answerId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
});

module.exports = {
  createAnswer,
  getAnswer,
  getAnswers,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
};
