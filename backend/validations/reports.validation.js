const Joi = require('joi');
const { objectId } = require('./custom.validation');

const queryReports = {
  query: Joi.object().keys({
    reason: Joi.string(),
    userId: Joi.string().custom(objectId),
    reportableId: Joi.string().custom(objectId),
    reportableType: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createReport = {
  body: Joi.object().keys({
    reason: Joi.string().required(),
    reportableId: Joi.string().custom(objectId).required(),
    reportableType: Joi.string().required(),
  }),
};

const deleteReport = {
  body: Joi.object().keys({
    reportId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  queryReports,
  createReport,
  deleteReport,
};
