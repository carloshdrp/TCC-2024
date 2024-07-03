const Joi = require('joi');

const createQuizQuestionAnswer = {
  body: Joi.object().keys({
    choice: Joi.string().required(),
  }),
  query: Joi.object().keys({
    questionId: Joi.string().required(),
    attemptId: Joi.string().required(),
  }),
};

const getQuizQuestionAnswers = {
  query: Joi.object().keys({
    questionId: Joi.string(),
    userId: Joi.string(),
    choice: Joi.string(),
    attemptId: Joi.string(),
  }),
};

const deleteQuizQuestionAnswer = {
  params: Joi.object().keys({
    quizQuestionAnswerId: Joi.string(),
  }),
};

module.exports = {
  createQuizQuestionAnswer,
  getQuizQuestionAnswers,
  deleteQuizQuestionAnswer,
};
