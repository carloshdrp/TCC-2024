const httpStatus = require('http-status');
const { prisma } = require('../config/database');
const ApiError = require('../utils/ApiError');

const queryReports = async (filter, options) => {
  return prisma.report.findMany({
    where: {
      id: filter.reportId,
      reason: filter.reason,
      reportedBy: {
        id: filter.userId,
      },
      reportableId: filter.reportableId,
      reportableType: filter.reportableType,
    },
    take: options.limit,
    skip: options.skip,
    orderBy: { createdAt: options.sortBy },
    include: {
      reportedBy: true,
    },
  });
};

const createReport = async (userId, reason, reportableId, reportableType) => {
  return prisma.report.create({
    data: {
      reportedBy: {
        connect: { id: userId },
      },
      reason,
      reportableId,
      reportableType,
    },
  });
};

const deleteReport = async (reportId) => {
  const report = await queryReports({ reportId }, {});
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Denúncia não encontrada');
  }

  return prisma.report.delete({
    where: { id: reportId },
  });
};

module.exports = {
  queryReports,
  createReport,
  deleteReport,
};
