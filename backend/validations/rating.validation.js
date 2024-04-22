const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRating = {
  body: Joi.object().keys({
    rateableId: Joi.string().required().custom(objectId),
    rateableType: Joi.string().required().valid('QUESTION', 'ANSWER', 'QUIZ'),
  }),
};

const getRating = {
  params: Joi.object().keys({
    ratingId: Joi.string().required().custom(objectId),
  }),
};

const getRatingByRateableId = {
  params: Joi.object().keys({
    rateableId: Joi.string().required().custom(objectId),
  }),
};

const getRatingByRateableType = {
  params: Joi.object().keys({
    rateableType: Joi.string().valid('QUESTION', 'ANSWER', 'QUIZ'),
  }),
};

const getRatingByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    rateableId: Joi.string().custom(objectId),
    rateableType: Joi.string().valid('QUESTION', 'ANSWER', 'QUIZ'),
  }),
};

const deleteRating = {
  params: Joi.object().keys({
    ratingId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createRating,
  getRating,
  getRatingByRateableId,
  getRatingByRateableType,
  getRatingByUserId,
  deleteRating,
};
