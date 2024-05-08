const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuizFeedback = {
  body: Joi.object().keys({
    score: Joi.number(),
  }),
  query: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
  }),
};

const getQuizFeedbacks = {
  query: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
    userId: Joi.string().custom(objectId),
    score: Joi.number(),
    shortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteQuizFeedback = {
  params: Joi.object().keys({
    quizFeedbackId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createQuizFeedback,
  getQuizFeedbacks,
  deleteQuizFeedback,
};
