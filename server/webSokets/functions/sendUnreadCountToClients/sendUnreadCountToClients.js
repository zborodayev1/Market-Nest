import { wss } from '../../../../index.js';

export const sendUnreadCountToClients = async (userId, increment) => {
  try {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN && client.userId === userId) {
        client.send(
          JSON.stringify({
            type: 'notificationUpdateUnreadCount',
            profileId: userId,
            increment: increment,
          })
        );
      }
    });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
  }
};

export const sendInitialUnreadCountToClients = async (userId, count) => {
  try {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN && client.userId === userId) {
        client.send(
          JSON.stringify({
            type: 'notificationInitialUnreadCount',
            profileId: userId,
            count: count,
          })
        );
      }
    });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
  }
};
