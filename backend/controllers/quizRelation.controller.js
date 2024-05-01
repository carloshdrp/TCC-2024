const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { quizRelationService } = require('../services');
const { pick } = require('../utils');

const createQuizRelation = catchAsync(async (req, res) => {
  const quizRelation = await quizRelationService.createQuizRelation(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(quizRelation);
});

const queryQuizRelations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['completed', 'quizId', 'userId']);
  const options = pick(req.query, ['limit', 'skip', 'sortBy']);
  const result = await quizRelationService.queryQuizRelations(filter, options);
  res.send(result);
});

const getQuizRelation = catchAsync(async (req, res) => {
  const quizRelation = await quizRelationService.getQuizRelationById(req.params.quizRelationId);
  res.send(quizRelation);
});

const updateQuizRelation = catchAsync(async (req, res) => {
  const quizRelation = await quizRelationService.updateQuizRelationById(req.user.id, req.params.quizRelationId, req.body);
  res.send(quizRelation);
});

const deleteQuizRelation = catchAsync(async (req, res) => {
  await quizRelationService.deleteQuizRelation(req.user.id, req.params.quizRelationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createQuizRelation,
  queryQuizRelations,
  getQuizRelation,
  updateQuizRelation,
  deleteQuizRelation,
};
