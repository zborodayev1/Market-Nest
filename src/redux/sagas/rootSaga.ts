import { all } from 'redux-saga/effects';
import { watchDeliverySaga } from './deliverySaga';
import { watchNotificationSaga } from './notificationSaga';

export function* rootSaga() {
  yield all([watchDeliverySaga(), watchNotificationSaga()]);
}
