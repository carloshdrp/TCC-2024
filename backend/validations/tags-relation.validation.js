const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTagRelation = {
  body: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
    tagId: Joi.string().custom(objectId),
  }),
};

const getTagRelations = {
  query: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
    tagId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTagRelation = {
  params: Joi.object().keys({
    tagRelationId: Joi.string().custom(objectId),
  }),
};

const updateTagRelation = {
  params: Joi.object().keys({
    tagRelationId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
    tagId: Joi.string().custom(objectId),
  }),
};

const deleteTagRelation = {
  params: Joi.object().keys({
    tagRelationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTagRelation,
  getTagRelations,
  getTagRelation,
  updateTagRelation,
  deleteTagRelation,
};
