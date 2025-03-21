import { call, put, takeLatest } from 'redux-saga/effects';
import axios from '../../axios';
import {
  deleteAllNotificationsFail,
  deleteAllNotificationsReq,
  deleteAllNotificationsSuc,
  fetchNotificationCountFail,
  fetchNotificationCountReq,
  fetchNotificationCountSuc,
  fetchNotificationFail,
  fetchNotificationReq,
  fetchNotificationSuc,
  getOneNotificationFail,
  getOneNotificationReq,
  getOneNotificationSuc,
  markAllNotificationsAsReadFail,
  markAllNotificationsAsReadReq,
  markAllNotificationsAsReadSuc,
  markNotificationAsReadFail,
  markNotificationAsReadReq,
  markNotificationAsReadSuc,
} from '../slices/notificationSlice';
import { Notification } from '../types/notification.type';

function* fetchNotificationsSaga(action: {
  payload: { page: number; limit: number; filter: string };
}) {
  try {
    const { page, limit, filter } = action.payload;
    const { data } = yield call(() =>
      axios.get<{ notifications: Notification[] }>(
        `/noti?page=${page}&limit=${limit}&filter=${filter}`
      )
    );
    yield put(fetchNotificationSuc(data));
  } catch (error: any) {
    yield put(
      fetchNotificationFail(
        error.response?.data || 'Failed to fetch notifications'
      )
    );
  }
}

function* markNotificationAsReadSaga(action: {
  payload: { notificationId: string };
}) {
  try {
    const { notificationId } = action.payload;
    const { data } = yield call(() => axios.patch(`/noti/${notificationId}`));
    yield put(markNotificationAsReadSuc(data));
  } catch (error: any) {
    yield put(
      markNotificationAsReadFail(
        error.response?.data || 'Failed to mark as read'
      )
    );
  }
}

function* fetchNotificationCountSaga() {
  try {
    const { data } = yield call(() => axios.get(`/noti/unread-count`));
    yield put(fetchNotificationCountSuc(data));
  } catch (error: any) {
    yield put(
      fetchNotificationCountFail(error.response?.data || 'Failed to get count')
    );
  }
}

function* deleteAllNotificationsSaga() {
  try {
    const { data } = yield call(() => axios.delete(`/noti/delete-all-noti`));
    yield put(deleteAllNotificationsSuc(data));
  } catch (error: any) {
    yield put(
      deleteAllNotificationsFail(
        error.response?.data || 'Failed to delete All Notifications'
      )
    );
  }
}

function* getOneNotificationSaga(action: { payload: { id: string } }) {
  try {
    const { id } = action.payload;
    const { data } = yield call(() => axios.get(`/noti/${id}`));
    yield put(getOneNotificationSuc(data));
  } catch (error: any) {
    yield put(
      getOneNotificationFail(
        error.response?.data || 'Failed to getOneNotification'
      )
    );
  }
}

function* markAllNotificationsAsReadSaga() {
  try {
    const { data } = yield call(() => axios.patch(`/noti/mark-all-read`));
    yield put(markAllNotificationsAsReadSuc(data));
  } catch (error: any) {
    yield put(
      markAllNotificationsAsReadFail(
        error.response?.data || 'Failed to markAllNotificationsAsRead'
      )
    );
  }
}

export function* watchNotificationSaga() {
  yield takeLatest(fetchNotificationReq, fetchNotificationsSaga);
  yield takeLatest(markNotificationAsReadReq, markNotificationAsReadSaga);
  yield takeLatest(fetchNotificationCountReq.type, fetchNotificationCountSaga);
  yield takeLatest(deleteAllNotificationsReq.type, deleteAllNotificationsSaga);
  yield takeLatest(getOneNotificationReq, getOneNotificationSaga);
  yield takeLatest(
    markAllNotificationsAsReadReq,
    markAllNotificationsAsReadSaga
  );
}
