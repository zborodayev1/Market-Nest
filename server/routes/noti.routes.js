import express from 'express';
import { NotiController } from '../controllers/index.js';
import { checkAuth } from '../utils/checkAuth.js';

const router = express.Router();

router.patch(
  '/mark-all-read',
  checkAuth,
  NotiController.markAllNotificationsAsRead
);
router.get(
  '/unread-count',
  checkAuth,
  NotiController.getNotificationUnreadCount
);
router.get('/', checkAuth, NotiController.getNotifications);
router.delete(
  '/delete-all-noti',
  checkAuth,
  NotiController.deleteAllNotifications
);

router.patch('/:id', checkAuth, NotiController.markNotificationAsRead);

export default router;
