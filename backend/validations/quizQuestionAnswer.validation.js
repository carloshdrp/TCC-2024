const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuizQuestionAnswer = {
  body: Joi.object().keys({
    choice: Joi.string().required(),
  }),
  query: Joi.object().keys({
    questionId: Joi.string().required().custom(objectId),
  }),
};

const getQuizQuestionAnswers = {
  query: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
    choice: Joi.string(),
  }),
};

const deleteQuizQuestionAnswer = {
  params: Joi.object().keys({
    quizQuestionAnswerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createQuizQuestionAnswer,
  getQuizQuestionAnswers,
  deleteQuizQuestionAnswer,
};
