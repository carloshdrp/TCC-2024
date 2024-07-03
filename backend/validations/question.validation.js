const Joi = require('joi');

const createQuestion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    tag: Joi.string().required(),
  }),
};

const getQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
};

const updateQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    locked: Joi.boolean(),
    userId: Joi.string(),
    tag: Joi.string(),
  }),
};

const deleteQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
};

module.exports = {
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};
