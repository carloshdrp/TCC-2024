const Joi = require('joi');

const createQuizAttempt = {
  body: Joi.object().keys({
    score: Joi.number(),
  }),
  query: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

const getQuizScore = {
  params: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

const getQuizAttempts = {
  query: Joi.object().keys({
    quizId: Joi.string(),
    userId: Joi.string(),
    score: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuizAttemptById = {
  params: Joi.object().keys({
    quizAttemptId: Joi.string(),
  }),
};

const deleteQuizAttempt = {
  params: Joi.object().keys({
    quizAttemptId: Joi.string(),
  }),
};

module.exports = {
  createQuizAttempt,
  getQuizScore,
  getQuizAttempts,
  getQuizAttemptById,
  deleteQuizAttempt,
};
