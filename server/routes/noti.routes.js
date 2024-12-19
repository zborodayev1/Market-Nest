import express from 'express'
import { NotiController } from '../controllers/index.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = express.Router()

router.patch(
  '/mark-all-read',
  checkAuth,
  NotiController.markAllNotificationsAsRead
)
router.post('/', checkAuth, NotiController.createNotification)
router.get('/', checkAuth, NotiController.getNotifications)
router.delete('/delete', checkAuth, NotiController.deleteNotifications)
router.patch('/:id', checkAuth, NotiController.markNotificationAsRead)

export default router
