const Joi = require('joi');
const { password } = require('./custom.validation');

const createUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      name: Joi.string().required(),
      password: Joi.string().required().custom(password),
      role: Joi.string().valid('INICIANTE', 'ESTUDIOSO', 'ADMIN'),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
      avatar: Joi.any(),
    })
    .messages({ 'string.email': 'O endereço de email fornecido não foi aceito pela validação!' }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().messages({
      'any.required': 'O ID do usuário é obrigatório',
      'string.base': 'O ID do usuário deve ser uma string',
      'string.custom': 'O ID do usuário não é válido',
    }),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email().required().messages({
        'string.empty': 'O email é um campo obrigatório!',
      }),
      password: Joi.string().custom(password),
      name: Joi.string().required().messages({
        'string.empty': 'O nome é um campo obrigatório!',
      }),
      avatar: Joi.any(),
    })
    .min(2)
    .messages({
      'object.min': 'Pelo menos dois campos devem ser fornecidos!',
      'any.required': 'Você deve informar todos os campos obrigatórios!',
      'string.email': 'O endereço de email fornecido não foi aceito pela validação!',
      'string.custom': 'O campo Senha não é válido',
    }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
