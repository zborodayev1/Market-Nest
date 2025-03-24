import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationType } from '../types/notification.type';

export const fetchNotificationReq = createAction<{
  page: number;
  limit: number;
  filter: string;
}>('notifications/fetchNotificationReq');

export const markNotificationAsReadReq = createAction<{
  notificationId: string;
}>('notifications/markNotificationAsReadReq');

interface NotificationsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  notifications: NotificationType[];
  total: number;
  totalPages: number;
  page: number;
  filter: string;
}

const initialState: NotificationsState = {
  status: 'idle',
  error: null,
  notifications: [],
  total: 0,
  totalPages: 0,
  page: 1,

  filter: 'read',
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notif) => notif._id !== action.payload
      );
    },

    fetchNotificationSuc: (
      state,
      action: PayloadAction<{
        notifications: NotificationType[];
        total: number;
        totalPages: number;
      }>
    ) => {
      state.status = 'succeeded';
      state.notifications = action.payload.notifications;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    },
    fetchNotificationFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Something went wrong';
    },
    markNotificationAsReadSuc: (
      state,
      action: PayloadAction<NotificationType>
    ) => {
      const index = state.notifications.findIndex(
        (notif) => notif._id === action.payload._id
      );
      if (index !== -1) {
        state.notifications[index].isRead = true;
      }
    },
    markNotificationAsReadFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Failed to mark as read';
    },
    fetchNotificationCountReq: (state) => {
      state.status = 'loading';
    },
    fetchNotificationCountSuc: (state) => {
      state.status = 'succeeded';
    },
    fetchNotificationCountFail: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Failed to fetch notification count';
    },
    deleteAllNotificationsReq: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    deleteAllNotificationsSuc: (state) => {
      state.status = 'succeeded';
      state.notifications = [];
    },
    deleteAllNotificationsFail: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Failed to delete notifications';
    },
    markAllNotificationsAsReadReq: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    markAllNotificationsAsReadSuc: (state) => {
      state.notifications = state.notifications.map((notif) => ({
        ...notif,
        isRead: true,
      }));
    },
    markAllNotificationsAsReadFail: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Failed to mark notifications as read';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotificationReq, (state) => {
      state.status = 'loading';
      state.error = null;
    });
  },
});

export const notificationsReducer = notificationsSlice.reducer;

export const {
  fetchNotificationFail,
  fetchNotificationSuc,
  markNotificationAsReadSuc,
  markNotificationAsReadFail,
  fetchNotificationCountReq,
  fetchNotificationCountSuc,
  fetchNotificationCountFail,
  deleteAllNotificationsReq,
  deleteAllNotificationsSuc,
  deleteAllNotificationsFail,
  markAllNotificationsAsReadReq,
  markAllNotificationsAsReadSuc,
  markAllNotificationsAsReadFail,
} = notificationsSlice.actions;
