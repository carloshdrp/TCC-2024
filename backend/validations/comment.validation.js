const Joi = require('joi');

const createComment = {
  body: Joi.object().keys({
    comment: Joi.string().required(),
    postId: Joi.string().required(),
    pinned: Joi.boolean(),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
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
