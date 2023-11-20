const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createComment = {
  body: Joi.object().keys({
    comment: Joi.string().required(),
    postId: Joi.string().required().custom(objectId),
    pinned: Joi.boolean(),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    comment: Joi.string().required(),
    pinned: Joi.boolean(),
  }),
};

module.exports = {
  createComment,
  updateComment,
};
