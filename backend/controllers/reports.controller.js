const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { questionService, answerService, quizService, reportsService } = require('../services');
const { pick, ApiError } = require('../utils');

const queryReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['reason', 'userId', 'reportableId', 'reportableType', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportsService.queryReports(filter, options);
  res.send(result);
});

const queryReportsByUserId = catchAsync(async (req, res) => {
  const result = await reportsService.queryReports({ userId: req.params.userId }, { sortBy: 'desc' });
  res.send(result);
});

const createReport = catchAsync(async (req, res) => {
  const report = await reportsService.createReport(
    req.user.id,
    req.body.reason,
    req.body.description,
    req.body.reportableId,
    req.body.reportableType,
  );

  if (req.body.reportableType === 'QUESTION') {
    const question = await questionService.getQuestionById(req.body.reportableId);
    if (!question) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Pergunta não encontrada');
    }
  } else if (req.body.reportableType === 'ANSWER') {
    const answer = await answerService.getAnswerById(req.body.reportableId);
    if (!answer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Resposta não encontrada');
    }
  } else {
    const quiz = await quizService.getQuizById(req.body.reportableId);
    if (!quiz) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Quiz não encontrado');
    }
  }

  res.status(httpStatus.CREATED).send(report);
});

const updateReportStatus = catchAsync(async (req, res) => {
  const report = await reportsService.updateReportStatus(req.params.reportId, req.body.status, req.body.message);
  res.send(report);
});

module.exports = {
  queryReports,
  queryReportsByUserId,
  createReport,
  updateReportStatus,
};
