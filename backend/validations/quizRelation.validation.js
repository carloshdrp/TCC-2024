const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuizRelation = {
  body: Joi.object().keys({
    completed: Joi.boolean(),
    quizId: Joi.string().custom(objectId).required(),
  }),
};

const getQuizRelation = {
  params: Joi.object().keys({
    quizRelationId: Joi.string().custom(objectId).required(),
  }),
};

const updateQuizRelation = {
  params: Joi.object().keys({
    quizRelationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    completed: Joi.boolean(),
    quizId: Joi.string().custom(objectId),
  }),
};

const deleteQuizRelation = {
  params: Joi.object().keys({
    quizRelationId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createQuizRelation,
  getQuizRelation,
  updateQuizRelation,
  deleteQuizRelation,
};
