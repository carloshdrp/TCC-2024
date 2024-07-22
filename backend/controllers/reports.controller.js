const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { questionService, answerService, quizService, reportsService } = require('../services');
const { pick, ApiError } = require('../utils');
const { createNotification } = require('../services/notification.service');
const { getUserSocket } = require('../socketManager');

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

  const notification = await createNotification(
    report.userId,
    'Uma de suas denúncias foi atualizada',
    'report-update',
    `/profile`,
  );
  const resourceOwnerSocket = getUserSocket(report.userId);
  if (resourceOwnerSocket) {
    resourceOwnerSocket.emit('newNotification', notification);
  } else {
    console.log(`Socket não encontrado para o usuário ${report.userId}`);
  }

  if (report.status === 'ACCEPTED') {
    if (report.reportableType === 'QUESTION') {
      const question = await questionService.getQuestionById(report.reportableId);
      const notification2 = await createNotification(
        question.userId,
        `Sua pergunta "${question.title}" foi removida por um administrador.`,
        'report-delete',
      );
      const resourceOwnerSocket2 = getUserSocket(question.userId);
      if (resourceOwnerSocket2) {
        resourceOwnerSocket2.emit('newNotification', notification2);
      } else {
        console.log(`Socket não encontrado para o usuário ${question.userId}`);
      }
    }
    if (report.reportableType === 'ANSWER') {
      const answer = await answerService.getAnswerById(report.reportableId);
      const notification3 = await createNotification(
        answer.userId,
        `Sua resposta para a pergunta "${answer.question.title}" foi removida por um administrador.`,
        'report-delete',
      );
      const resourceOwnerSocket3 = getUserSocket(answer.userId);
      if (resourceOwnerSocket3) {
        resourceOwnerSocket3.emit('newNotification', notification3);
      } else {
        console.log(`Socket não encontrado para o usuário ${answer.userId}`);
      }
    }
    if (report.reportableType === 'QUIZ') {
      const quiz = await quizService.getQuizById(report.reportableId);
      const notification4 = await createNotification(
        quiz.userId,
        `Seu questionário "${quiz.title}" foi removido por um administrador.`,
        'report-delete',
      );
      const resourceOwnerSocket4 = getUserSocket(quiz.userId);
      if (resourceOwnerSocket4) {
        resourceOwnerSocket4.emit('newNotification', notification4);
      } else {
        console.log(`Socket não encontrado para o usuário ${quiz.userId}`);
      }
    }
  }

  res.send(report);
});

module.exports = {
  queryReports,
  queryReportsByUserId,
  createReport,
  updateReportStatus,
};
