const Joi = require('joi');

const createAnswer = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    questionId: Joi.string(),
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
    answerId: Joi.string(),
  }),
};

const getAnswersByQuestionId = {
  params: Joi.object().keys({
    questionId: Joi.string(),
  }),
};

const updateAnswer = {
  params: Joi.object().keys({
    answerId: Joi.required(),
  }),
  body: Joi.object().keys({
    description: Joi.string(),
  }),
};

const deleteAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string(),
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
