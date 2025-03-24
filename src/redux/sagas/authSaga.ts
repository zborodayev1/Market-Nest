import { call, put, takeLatest } from 'redux-saga/effects';
import axios from '../../axios';
import {
  completeRegistrationFail,
  completeRegistrationReq,
  completeRegistrationSuc,
  confirmPasswordChangeFail,
  confirmPasswordChangeSuc,
  confirmPhoneChangeFail,
  confirmPhoneChangeReq,
  confirmPhoneChangeSuc,
  deleteAvatarFail,
  deleteAvatarReq,
  deleteAvatarSuc,
  fetchProfileDataFail,
  fetchProfileDataReq,
  fetchProfileDataSuc,
  getUserProfileFail,
  getUserProfileReq,
  getUserProfileSuc,
  loginFail,
  loginReq,
  loginSuc,
  logoutFail,
  logoutReq,
  logoutSuc,
  requestPasswordChangeFail,
  requestPasswordChangeSuc,
  requestPhoneChangeFail,
  requestPhoneChangeReq,
  requestPhoneChangeSuc,
  temporaryRegisterFail,
  temporaryRegisterReq,
  temporaryRegisterSuc,
  updateProfileDataFail,
  updateProfileDataReq,
  updateProfileDataSuc,
  updateProfileEmailFail,
  updateProfileEmailReq,
  updateProfileEmailSuc,
  updateProfilePasswordFail,
  updateProfilePasswordReq,
  updateProfilePasswordSuc,
  updateProfilePhoneFail,
  updateProfilePhoneReq,
  updateProfilePhoneSuc,
  uploadAvatarFail,
  uploadAvatarReq,
  uploadAvatarSuc,
} from '../slices/authSlice';
import {
  confirmPasswordChangeReq,
  requestPasswordChangeReq,
} from './../slices/authSlice';

function* temporaryRegisterSaga(
  action: ReturnType<typeof temporaryRegisterReq>
) {
  try {
    const { data } = yield call(
      axios.post,
      '/auth/temporary-register',
      action.payload
    );
    yield put(temporaryRegisterSuc(data));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to register';
    yield put(temporaryRegisterFail(errorMessage));
  }
}

function* completeRegistrationSaga(
  action: ReturnType<typeof completeRegistrationReq>
) {
  try {
    const { data } = yield call(() =>
      axios.post(`/auth/complete-register`, action.payload)
    );
    yield put(completeRegistrationSuc(data));
  } catch (error: any) {
    yield put(
      completeRegistrationFail(
        error.response?.data || 'Failed to completeRegistration'
      )
    );
  }
}

function* logoutSaga() {
  try {
    const { data } = yield call(() => axios.post(`/auth/logout`));
    yield put(logoutSuc(data));
  } catch (error: any) {
    yield put(logoutFail(error.response?.data || 'Failed to logout'));
  }
}

function* fetchProfileDataSaga() {
  try {
    const { data } = yield call(() => axios.get(`/auth/profile`));
    yield put(fetchProfileDataSuc(data));
  } catch (error: any) {
    yield put(
      fetchProfileDataFail(error.response?.data || 'Failed to fetchProfileData')
    );
  }
}

function* requestPasswordChangeSaga(
  action: ReturnType<typeof requestPasswordChangeReq>
) {
  try {
    const { data } = yield call(() =>
      axios.post(`/auth/request-password-change-code`, action.payload)
    );
    yield put(requestPasswordChangeSuc(data));
  } catch (error: any) {
    yield put(
      requestPasswordChangeFail(
        error.response?.data || 'Failed to requestPasswordChange'
      )
    );
  }
}

function* confirmPasswordChangeSaga(
  action: ReturnType<typeof confirmPasswordChangeReq>
) {
  try {
    const { data } = yield call(() =>
      axios.post(`/auth/confirm-password-change`, action.payload)
    );
    yield put(confirmPasswordChangeSuc(data));
  } catch (error: any) {
    yield put(
      confirmPasswordChangeFail(
        error.response?.data || 'Failed to confirmPasswordChange'
      )
    );
  }
}

function* uploadAvatarSaga(action: ReturnType<typeof uploadAvatarReq>) {
  try {
    const { data } = yield call(() =>
      axios.patch(`/auth/user/avatar`, action.payload)
    );
    yield put(uploadAvatarSuc(data));
  } catch (error: any) {
    yield put(
      uploadAvatarFail(error.response?.data || 'Failed to uploadAvatar')
    );
  }
}

function* deleteAvatarSaga(action: ReturnType<typeof deleteAvatarReq>) {
  try {
    const { data } = yield call(() =>
      axios.delete(`/auth/user/avatar`, { data: action.payload })
    );
    yield put(deleteAvatarSuc(data));
  } catch (error: any) {
    yield put(
      deleteAvatarFail(error.response?.data || 'Failed to deleteAvatar')
    );
  }
}

function* loginSaga(action: ReturnType<typeof loginReq>) {
  try {
    const { data } = yield call(() =>
      axios.post(`/auth/login`, action.payload)
    );
    yield put(loginSuc(data));
  } catch (error: any) {
    yield put(loginFail(error.response?.data || 'Failed to login'));
  }
}

function* getUserProfileSaga(action: { payload: { userId: string } }) {
  try {
    const { userId } = action.payload;
    const { data } = yield call(() => axios.get(`/auth/user/${userId}`));
    yield put(getUserProfileSuc(data));
  } catch (error: any) {
    yield put(
      getUserProfileFail(error.response?.data || 'Failed to getUserProfile')
    );
  }
}

function* updateProfileDataSaga(
  action: ReturnType<typeof updateProfileDataReq>
) {
  try {
    const { data } = yield call(() =>
      axios.patch(`/auth/profile/data`, action.payload)
    );
    yield put(updateProfileDataSuc(data));
  } catch (error: any) {
    yield put(
      updateProfileDataFail(
        error.response?.data || 'Failed to updateProfileData'
      )
    );
  }
}

function* updateProfileEmailSaga(
  action: ReturnType<typeof updateProfileEmailReq>
) {
  try {
    const { data } = yield call(() =>
      axios.patch(`/auth/profile/email`, action.payload)
    );
    yield put(updateProfileEmailSuc(data));
  } catch (error: any) {
    yield put(
      updateProfileEmailFail(
        error.response?.data || 'Failed to updateProfileEmail'
      )
    );
  }
}

function* updateProfilePasswordSaga(
  action: ReturnType<typeof updateProfilePasswordReq>
) {
  try {
    const { data } = yield call(() =>
      axios.patch(`/auth/profile/password`, action.payload)
    );
    yield put(updateProfilePasswordSuc(data));
  } catch (error: any) {
    yield put(
      updateProfilePasswordFail(
        error.response?.data || 'Failed to updateProfilePassword'
      )
    );
  }
}

function* updateProfilePhoneSaga(
  action: ReturnType<typeof updateProfilePhoneReq>
) {
  try {
    const { data } = yield call(() =>
      axios.patch(`/auth/profile/phone`, action.payload)
    );
    yield put(updateProfilePhoneSuc(data));
  } catch (error: any) {
    yield put(
      updateProfilePhoneFail(
        error.response?.data || 'Failed to updateProfilePhone'
      )
    );
  }
}

function* requestPhoneChangeSaga(
  action: ReturnType<typeof requestPhoneChangeReq>
) {
  try {
    const { data } = yield call(() =>
      axios.post(`/auth/request-phone-change-code`, action.payload)
    );
    yield put(requestPhoneChangeSuc(data));
  } catch (error: any) {
    yield put(
      requestPhoneChangeFail(
        error.response?.data || 'Failed to requestPhoneChange'
      )
    );
  }
}

function* confirmPhoneChangeSaga(
  action: ReturnType<typeof confirmPhoneChangeReq>
) {
  try {
    const { data } = yield call(() =>
      axios.post(`/auth/confirm-phone-change`, action.payload)
    );
    yield put(confirmPhoneChangeSuc(data));
  } catch (error: any) {
    yield put(
      confirmPhoneChangeFail(
        error.response?.data || 'Failed to confirmPhoneChange'
      )
    );
  }
}

export function* watchAuthSaga() {
  yield takeLatest(temporaryRegisterReq, temporaryRegisterSaga);
  yield takeLatest(logoutReq.type, logoutSaga);
  yield takeLatest(fetchProfileDataReq.type, fetchProfileDataSaga);
  yield takeLatest(completeRegistrationReq, completeRegistrationSaga);
  yield takeLatest(requestPasswordChangeReq, requestPasswordChangeSaga);
  yield takeLatest(confirmPasswordChangeReq, confirmPasswordChangeSaga);
  yield takeLatest(uploadAvatarReq, uploadAvatarSaga);
  yield takeLatest(deleteAvatarReq, deleteAvatarSaga);
  yield takeLatest(loginReq, loginSaga);
  yield takeLatest(getUserProfileReq, getUserProfileSaga);
  yield takeLatest(updateProfileDataReq, updateProfileDataSaga);
  yield takeLatest(updateProfileEmailReq, updateProfileEmailSaga);
  yield takeLatest(updateProfilePasswordReq, updateProfilePasswordSaga);
  yield takeLatest(updateProfilePhoneReq, updateProfilePhoneSaga);
  yield takeLatest(requestPhoneChangeReq, requestPhoneChangeSaga);
  yield takeLatest(confirmPhoneChangeReq, confirmPhoneChangeSaga);
}
