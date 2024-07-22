const { prisma } = require('../config/database');

const createNotification = async (recipientId, content, category, resourceId) => {
  return prisma.notification.create({
    data: {
      recipientId,
      content,
      category,
      resourceId,
    },
  });
};

const getNotificationsByRecipientId = async (recipientId) => {
  return prisma.notification.findMany({
    where: { recipientId },
    orderBy: { createdAt: 'desc' },
  });
};

const markNotificationAsRead = async (notificationId) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
};

const markAllNotificationsAsRead = async (recipientId) => {
  return prisma.notification.updateMany({
    where: {
      recipientId,
      readAt: null,
    },
    data: { readAt: new Date() },
  });
};

module.exports = {
  createNotification,
  getNotificationsByRecipientId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
