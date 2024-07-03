const Joi = require('joi');

const queryReports = {
  query: Joi.object().keys({
    reason: Joi.string().valid('SPAM', 'INAPROPRIADO', 'OFENSIVO', 'LINKS', 'OUTRO'),
    userId: Joi.string(),
    reportableId: Joi.string(),
    reportableType: Joi.string().valid('QUESTION', 'ANSWER', 'QUIZ'),
    status: Joi.string().valid('PENDING', 'ACCEPTED', 'REJECTED'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createReport = {
  body: Joi.object().keys({
    reason: Joi.string().valid('SPAM', 'INAPROPRIADO', 'OFENSIVO', 'LINKS', 'OUTRO').required(),
    description: Joi.string().optional(),
    reportableId: Joi.string().required(),
    reportableType: Joi.string().valid('QUESTION', 'ANSWER', 'QUIZ').required(),
  }),
};

const updateReportStatus = {
  params: Joi.object().keys({
    reportId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('PENDING', 'ACCEPTED', 'REJECTED').required(),
    message: Joi.string().empty(),
  }),
};

module.exports = {
  queryReports,
  createReport,
  updateReportStatus,
};
