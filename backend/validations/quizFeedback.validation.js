const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuizAttempt = {
  body: Joi.object().keys({
    score: Joi.number(),
  }),
  query: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
  }),
};

const getQuizScore = {
  params: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
  }),
};

const getQuizAttempts = {
  query: Joi.object().keys({
    quizId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
    score: Joi.number(),
    shortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteQuizAttempt = {
  params: Joi.object().keys({
    quizAttemptId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createQuizAttempt,
  getQuizScore,
  getQuizAttempts,
  deleteQuizAttempt,
};
