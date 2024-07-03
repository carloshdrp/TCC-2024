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
      status: filter.status,
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

const createReport = async (userId, reason, description, reportableId, reportableType) => {
  return prisma.report.create({
    data: {
      reportedBy: {
        connect: { id: userId },
      },
      reason,
      description,
      reportableId,
      reportableType,
    },
  });
};

const updateReportStatus = async (reportId, status, message) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Denúncia não encontrada');
  }

  return prisma.report.update({
    where: { id: reportId },
    data: { status, message },
  });
};

module.exports = {
  queryReports,
  createReport,
  updateReportStatus,
};
