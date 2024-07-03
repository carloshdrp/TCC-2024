const Joi = require('joi');

const createQuizRelation = {
  body: Joi.object().keys({
    completed: Joi.boolean(),
    quizId: Joi.string().required(),
  }),
};

const getQuizRelation = {
  params: Joi.object().keys({
    quizRelationId: Joi.string().required(),
  }),
};

const updateQuizRelation = {
  params: Joi.object().keys({
    quizRelationId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    completed: Joi.boolean(),
    quizId: Joi.string(),
  }),
};

const deleteQuizRelation = {
  params: Joi.object().keys({
    quizRelationId: Joi.string().required(),
  }),
};

module.exports = {
  createQuizRelation,
  getQuizRelation,
  updateQuizRelation,
  deleteQuizRelation,
};
