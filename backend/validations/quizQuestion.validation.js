const Joi = require('joi');

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
    quizId: Joi.string().required(),
  }),
};

const getQuizQuestions = {
  query: Joi.object().keys({
    quizId: Joi.string().required(),
  }),
};

const getQuizQuestion = {
  params: Joi.object().keys({
    quizQuestionId: Joi.string().required(),
  }),
};

const updateQuizQuestion = {
  query: Joi.object().keys({
    quizId: Joi.string().required(),
    quizQuestionId: Joi.string().required(),
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
    quizId: Joi.string().required(),
    quizQuestionId: Joi.string().required(),
  }),
};

module.exports = {
  createQuizQuestion,
  getQuizQuestions,
  getQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
};
