const Joi = require('joi');

const createRating = {
  body: Joi.object().keys({
    rateableId: Joi.string().required(),
    rateableType: Joi.string().required().valid('QUESTION', 'ANSWER', 'QUIZ'),
  }),
};

const getRating = {
  params: Joi.object().keys({
    ratingId: Joi.string().required(),
  }),
};

const getRatingByRateableId = {
  params: Joi.object().keys({
    rateableId: Joi.string().required(),
  }),
};

const getRatingByRateableType = {
  params: Joi.object().keys({
    rateableType: Joi.string().valid('QUESTION', 'ANSWER', 'QUIZ'),
  }),
};

const getRatingByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  query: Joi.object().keys({
    rateableId: Joi.string(),
    rateableType: Joi.string().valid('QUESTION', 'ANSWER', 'QUIZ'),
  }),
};

const deleteRating = {
  params: Joi.object().keys({
    ratingId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().required(),
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
