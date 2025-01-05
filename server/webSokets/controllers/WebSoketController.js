import NotiModel from '../../models/noti.js'

const countUnreadNoti = async (userId) => {
  try {
    const unreadCount = await NotiModel.countDocuments({
      userId,
      isRead: false,
    })
    return unreadCount
  } catch (error) {
    console.error('Error counting unread notifications:', error)
    throw new Error('Failed to count unread notifications')
  }
}

export const handleGetUnreadCountWS = async (ws, userId) => {
  try {
    const unreadCount = await countUnreadNoti(userId)

    ws.send(
      JSON.stringify({
        type: 'notificationUpdate',
        profileId: userId,
        unreadCount,
      })
    )
  } catch (error) {
    console.error('Error handling WebSocket message:', error)
    ws.send(
      JSON.stringify({
        status: 'error',
        message: 'Failed to count unread notifications',
      })
    )
  }
}
