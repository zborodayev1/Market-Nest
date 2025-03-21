import { call, put, takeLatest } from 'redux-saga/effects';
import axios from '../../axios';
import {
  fetchDeliveryFail,
  fetchDeliveryReq,
  fetchDeliverySuc,
} from '../slices/deliverySlice';
import { Delivery } from '../types/delivery.type';

function* fetchDeliverySaga() {
  try {
    const { data } = yield call(() =>
      axios.get<{ deliveries: Delivery[] }>('/del')
    );
    yield put(fetchDeliverySuc(data.deliveries));
  } catch (error: any) {
    yield put(
      fetchDeliveryFail(error.response?.data || 'Failed to get delivery')
    );
  }
}

export function* watchDeliverySaga() {
  yield takeLatest(fetchDeliveryReq.type, fetchDeliverySaga);
}
