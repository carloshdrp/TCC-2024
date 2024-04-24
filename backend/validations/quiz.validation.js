const Joi = require('joi');
const { Subject } = require('@prisma/client');
const { objectId } = require('./custom.validation');

const createQuiz = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    subject: Joi.string().required(),
    difficulty: Joi.string(),
    isCompleted: Joi.boolean(),
  }),
};

const getQuizzes = {
  query: Joi.object().keys({
    title: Joi.string(),
    subject: Joi.string().valid(...Object.values(Subject)),
    userId: Joi.string().custom(objectId),
    difficulty: Joi.string(),
    isCompleted: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuiz = {
  params: Joi.object().keys({
    quizId: Joi.string().custom(objectId),
  }),
};

const updateQuiz = {
  params: Joi.object().keys({
    quizId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    Subject: Joi.string().valid(...Object.values(Subject)),
    difficulty: Joi.string(),
    isCompleted: Joi.boolean(),
    userId: Joi.string().custom(objectId),
  }),
};

const deleteQuiz = {
  params: Joi.object().keys({
    quizId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
};
