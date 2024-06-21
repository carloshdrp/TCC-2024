const Joi = require('joi');
const { objectId } = require('./custom.validation');

const incrementPoints = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    amount: Joi.number().required(),
  }),
};

const decrementPoints = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    amount: Joi.number().required(),
  }),
};

module.exports = {
  incrementPoints,
  decrementPoints,
};
