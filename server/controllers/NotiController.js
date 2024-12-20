import NotiModel from '../models/noti.js'
import UserModel from '../models/user.js'
import mongoose from 'mongoose'

export const createNotification = async (req, res) => {
  const { actionType, title, productId } = req.body
  const userId = req.userId
  let type = 'info'

  switch (actionType) {
    case 'created':
      type = 'success'
      break
    case 'approved':
      type = 'success'
      break
    case 'rejected':
      type = 'error'
      break
    default:
      type = 'info'
      break
  }

  try {
    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const notification = new NotiModel({
      type: type,
      title: title || 'Untitled Notification',
      actionType: actionType,
      productId: productId,
      userId: userId,
    })

    await notification.save()

    res.status(201).json(notification)
  } catch (error) {
    console.error('Error creating notification:', error)
    res.status(500).json({ message: 'Failed to create notification' })
  }
}

export const getNotifications = async (req, res) => {
  const userId = req.userId
  const { page = 1, limit = 4, filter = 'unread' } = req.query

  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    const pageNumber = Math.max(Number(page), 1)
    const pageSize = Math.max(Number(limit), 4)

    const matchFilter =
      filter === 'read'
        ? { isRead: true }
        : filter === 'unread'
          ? { isRead: false }
          : {}

    const notifications = await NotiModel.find({
      userId,
      ...matchFilter,
    })
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)

    const total = await NotiModel.countDocuments({
      userId,
      ...matchFilter,
    })

    const totalPages = Math.ceil(total / pageSize)

    res.json({
      page: pageNumber,
      limit: pageSize,
      total: total,
      totalPages,
      notifications,
    })
  } catch (error) {
    console.error('Error getting notifications:', error)
    res.status(500).json({ message: 'Failed to get notifications' })
  }
}

export const markNotificationAsRead = async (req, res) => {
  const userId = req.userId
  const { id } = req.params

  try {
    const notification = await NotiModel.findOne({ _id: id, userId })

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    notification.isRead = true
    await notification.save()

    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    res.status(500).json({ message: 'Failed to mark notification as read' })
  }
}

export const deleteNotifications = async (req, res) => {
  const userId = req.userId
  const { notificationIds } = req.body

  try {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'Array of notification IDs is required' })
    }

    const notificationsToDelete = await NotiModel.find({
      _id: { $in: notificationIds },
      userId,
    })

    if (notificationsToDelete.length === 0) {
      return res.status(404).json({ message: 'No notifications found' })
    }

    await NotiModel.deleteMany({
      _id: { $in: notificationIds },
      userId,
    })

    res.status(200).json({
      message: 'Notifications deleted successfully',
      deletedNotifications: notificationsToDelete,
    })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    res.status(500).json({ message: 'Failed to delete notifications' })
  }
}

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId

    const updatedNotifications = await NotiModel.updateMany(
      { userId: userId, isRead: false },
      { isRead: true }
    )

    if (updatedNotifications.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No notifications found to update',
      })
    }

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: err.message,
    })
  }
}
