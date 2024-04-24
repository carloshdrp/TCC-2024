const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuizQuestion = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    correct: Joi.string().required(),
    wrong1: Joi.string().required(),
    wrong2: Joi.string().required(),
    wrong3: Joi.string().required(),
    wrong4: Joi.string().required(),
  }),
  query: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
  }),
};

const getQuizQuestions = {
  query: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
  }),
};

const getQuizQuestion = {
  params: Joi.object().keys({
    quizQuestionId: Joi.string().required().custom(objectId),
  }),
};

const updateQuizQuestion = {
  query: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
    quizQuestionId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    description: Joi.string(),
    correct: Joi.string(),
    wrong1: Joi.string(),
    wrong2: Joi.string(),
    wrong3: Joi.string(),
    wrong4: Joi.string(),
  }),
};

const deleteQuizQuestion = {
  query: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
    quizQuestionId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createQuizQuestion,
  getQuizQuestions,
  getQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
};
