const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const getNotifications = catchAsync(async (req, res) => {
  const recipientId = req.user.id;
  const notifications = await notificationService.getNotificationsByRecipientId(recipientId);
  res.send(notifications);
});

const markNotificationAsRead = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await notificationService.markNotificationAsRead(notificationId);
  res.send(notification);
});

const markAllNotificationsAsRead = catchAsync(async (req, res) => {
  const recipientId = req.user.id;
  await notificationService.markAllNotificationsAsRead(recipientId);
  const updatedNotifications = await notificationService.getNotificationsByRecipientId(recipientId);
  res.send(updatedNotifications);
});

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
