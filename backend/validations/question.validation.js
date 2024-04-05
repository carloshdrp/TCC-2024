const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuestion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const getQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required().custom(objectId),
  }),
};

const updateQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    locked: Joi.boolean(),
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createQuestion,
  getQuestion,
  updateQuestion,
};
