import { all } from 'redux-saga/effects';
import { watchAuthSaga } from './authSaga';
import { watchDeliverySaga } from './deliverySaga';
import { watchNotificationSaga } from './notificationSaga';

export function* rootSaga() {
  yield all([watchDeliverySaga(), watchNotificationSaga(), watchAuthSaga()]);
}
