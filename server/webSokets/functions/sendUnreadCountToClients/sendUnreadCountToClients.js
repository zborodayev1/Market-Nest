import { wss } from '../../../../index.js'

export const sendUnreadCountToClients = async (userId, increment) => {
  try {
    // const unreadCount = await NotiModel.countDocuments({
    //   userId,
    //   isRead: false,
    // })

    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN && client.userId === userId) {
        client.send(
          JSON.stringify({
            type: 'notificationUpdate',
            profileId: userId,
            increment: increment,
          })
        )
      }
    })
  } catch (error) {
    console.error('Error counting unread notifications:', error)
  }
}
