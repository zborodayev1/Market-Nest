import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../types/notification';

export const fetchNotificationReq = createAction<{
  page: number;
  limit: number;
  filter: string;
}>('notifications/fetchNotificationReq');

export const markNotificationAsReadReq = createAction<{
  notificationId: string;
}>('notifications/markNotificationAsReadReq');

export const getOneNotificationReq = createAction<{
  id: string;
}>('notifications/getOneNotificationReq');

interface NotificationsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  notifications: Notification[];
  total: number;
  totalPages: number;
  page: number;
  filter: string;
  fullNotifi: Notification | null;
  unread: number;
}

const initialState: NotificationsState = {
  status: 'idle',
  error: null,
  notifications: [],
  total: 0,
  totalPages: 0,
  page: 1,
  fullNotifi: null,
  filter: 'read',
  unread: 0,
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
    clearFullNotifi: (state) => {
      state.fullNotifi = null;
    },
    fetchNotificationSuc: (
      state,
      action: PayloadAction<{
        notifications: Notification[];
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
    markNotificationAsReadSuc: (state, action: PayloadAction<Notification>) => {
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
    fetchNotificationCountSuc: (state, action: PayloadAction<number>) => {
      state.status = 'succeeded';
      state.unread = action.payload;
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
    getOneNotificationSuc: (state, action: PayloadAction<Notification>) => {
      state.status = 'succeeded';
      state.fullNotifi = action.payload;
    },
    getOneNotificationFail: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Failed to get notification';
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

export const selectFullNotifi = (state: {
  notifications: NotificationsState;
}) => state.notifications.fullNotifi;

export const clearFullNotifi = notificationsSlice.actions.clearFullNotifi;

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
  getOneNotificationSuc,
  getOneNotificationFail,
} = notificationsSlice.actions;
