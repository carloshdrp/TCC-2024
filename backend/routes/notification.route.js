const express = require('express');
const { notificationController } = require('../controllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(auth(), notificationController.getNotifications);

router.route('/:notificationId/read').patch(auth(), notificationController.markNotificationAsRead);

router.route('/read-all').post(auth(), notificationController.markAllNotificationsAsRead);

module.exports = router;
