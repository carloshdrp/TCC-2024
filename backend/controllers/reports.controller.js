const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { questionService, answerService, quizService, reportsService } = require('../services');
const { pick, ApiError } = require('../utils');

const queryReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['reason', 'userId', 'reportableId', 'reportableType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportsService.queryReports(filter, options);
  res.send(result);
});

const createReport = catchAsync(async (req, res) => {
  const report = await reportsService.createReport(
    req.user.id,
    req.body.reason,
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

const deleteReport = catchAsync(async (req, res) => {
  await reportsService.deleteReport(req.body.reportId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  queryReports,
  createReport,
  deleteReport,
};
