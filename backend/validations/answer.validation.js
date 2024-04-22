const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAnswer = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    questionId: Joi.string().custom(objectId),
  }),
};

const getAnswers = {
  query: Joi.object().keys({
    content: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().custom(objectId),
  }),
};

const getAnswersByQuestionId = {
  params: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
  }),
};

const updateAnswer = {
  params: Joi.object().keys({
    answerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    description: Joi.string(),
  }),
};

const deleteAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAnswer,
  getAnswers,
  getAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
};
