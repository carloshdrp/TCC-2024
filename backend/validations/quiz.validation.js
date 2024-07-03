const Joi = require('joi');
const { Subject } = require('@prisma/client');

const createQuiz = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    subject: Joi.string().required(),
    difficulty: Joi.string(),
  }),
};

const getQuizzes = {
  query: Joi.object().keys({
    title: Joi.string(),
    subject: Joi.string().valid(...Object.values(Subject)),
    userId: Joi.string(),
    difficulty: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuiz = {
  params: Joi.object().keys({
    quizId: Joi.string(),
  }),
};

const updateQuiz = {
  params: Joi.object().keys({
    quizId: Joi.required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    subject: Joi.string().valid(...Object.values(Subject)),
    difficulty: Joi.string(),
    userId: Joi.string(),
  }),
};

const deleteQuiz = {
  params: Joi.object().keys({
    quizId: Joi.string(),
  }),
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
};
