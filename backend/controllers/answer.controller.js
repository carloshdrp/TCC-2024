const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { answerService, questionService } = require('../services');
const { pick, ApiError } = require('../utils');
const { createNotification } = require('../services/notification.service');
const { getUserSocket } = require('../socketManager');
const { checkAndAwardAchievements } = require('../services/achievement.service');

const createAnswer = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { questionId, ...answerBody } = req.body;

  const question = await questionService.getQuestionById(questionId);
  if (question.userId === userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não pode responder a sua própria pergunta');
  }

  try {
    const answer = await answerService.createAnswer(answerBody, userId, questionId);
    await checkAndAwardAchievements(userId);

    const notification = await createNotification(
      question.userId,
      'Sua pergunta recebeu uma resposta',
      'answer-received',
      `/forum/${question.id}`,
    );
    const resourceOwnerSocket = getUserSocket(question.userId);
    if (resourceOwnerSocket) {
      resourceOwnerSocket.emit('newNotification', notification);
    } else {
      console.log(`Socket não encontrado para o usuário ${question.userId}`);
    }

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

const attachAnswer = catchAsync(async (req, res, next) => {
  const answer = await answerService.getAnswerById(req.params.answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resposta não encontrada');
  }
  req.answer = answer;
  req.resourceOwnerId = answer.userId;
  next();
});

module.exports = {
  createAnswer,
  getAnswer,
  getAnswers,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
  attachAnswer,
};
