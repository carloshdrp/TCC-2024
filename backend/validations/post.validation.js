const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    solved: Joi.boolean(),
  }),
};

module.exports = {
  createPost,
  updatePost,
};
