/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction, createSlice } from '@reduxjs/toolkit';
import { UserProfile } from '../types/auth.type';

export const temporaryRegisterReq = createAction<{
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}>('auth/temporaryRegisterReq');

export const completeRegistrationReq = createAction<{
  email: string;
  code: string;
}>('auth/completeRegistrationReq');

export const requestPasswordChangeReq = createAction<{
  newPassword: string;
}>('auth/requestPasswordChangeReq');

export const confirmPasswordChangeReq = createAction<{
  verificationCode: string;
}>('auth/confirmPasswordChangeReq');

export const uploadAvatarReq = createAction<FormData>('auth/uploadAvatar');

export const deleteAvatarReq = createAction<FormData>('auth/deleteAvatar');

export const loginReq = createAction<{
  email: string;
  password: string;
}>('auth/loginReq');

export const getUserProfileReq = createAction<{
  userId: string;
}>('auth/getUserProfileReq');

export const updateProfileDataReq = createAction<{
  fullName?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}>('auth/updateProfileDataReq');

export const updateProfileEmailReq = createAction<{
  email: string;
  password: string;
}>('auth/updateProfileEmailReq');

export const updateProfilePasswordReq = createAction<{
  oldPassword: string;
  password: string;
}>('auth/updateProfilePasswordReq');

export const updateProfilePhoneReq = createAction(
  'auth/updateProfilePhoneReq',
  (payload: { phone: string; password: string }) => ({
    payload,
  })
);

export const requestPhoneChangeReq = createAction<{
  newPhone: string;
}>('auth/requestPhoneChangeReq');

export const confirmPhoneChangeReq = createAction<{
  verificationCode: string;
}>('auth/confirmPhoneChangeReq');

interface AuthState {
  user: UserProfile | null;
  isAuth: boolean;
  productUser: UserProfile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
  message: string;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  productUser: null,
  status: 'idle',
  error: null,
  loading: false,
  message: '',
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.error = null;
      state.token = null;
      localStorage.removeItem('token');
    },

    temporaryRegisterSuc: (state) => {
      state.status = 'succeeded';
      state.loading = false;
    },
    temporaryRegisterFail: (state, action: any) => {
      state.status = 'failed';
      state.error = action.payload;
      state.loading = false;
    },
    fetchProfileDataReq: (state) => {
      state.status = 'loading';
      state.error = null;
      state.loading = true;
    },
    fetchProfileDataSuc: (state) => {
      state.status = 'succeeded';
      state.loading = false;
    },
    fetchProfileDataFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      state.loading = false;
    },
    completeRegistrationSuc: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user || (action.payload as UserProfile);
      state.isAuth = true;
      state.error = null;
      state.loading = false;
      state.token = action.payload.token;
    },
    completeRegistrationFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
    },
    requestPasswordChangeSuc: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      if (action.payload.message) {
        state.message = action.payload.message;
      }
    },
    requestPasswordChangeFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    confirmPasswordChangeSuc: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      if (action.payload.message) {
        state.message = action.payload.message;
      }
    },
    confirmPasswordChangeFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    uploadAvatarSuc: (state, action) => {
      if (state.user) {
        state.user.avatarUrl = action.payload.avatarUrl;
      }
      state.loading = false;
      state.status = 'succeeded';
    },
    uploadAvatarFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    deleteAvatarSuc: (state, action) => {
      if (state.user) {
        state.user.avatarUrl = action.payload.avatarUrl;
      }
      state.loading = false;
      state.status = 'succeeded';
    },
    deleteAvatarFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    loginSuc: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user || (action.payload as UserProfile);
      state.token = action.payload.token;
      state.isAuth = true;
      state.error = null;
      state.loading = false;
      localStorage.setItem('token', action.payload.token);
    },
    loginFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      state.loading = false;
    },
    getUserProfileSuc: (state, action) => {
      state.status = 'succeeded';
      state.productUser = action.payload;
      state.loading = false;
    },
    getUserProfileFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      state.loading = false;
    },
    updateProfileDataSuc: (state, action) => {
      state.status = 'succeeded';
      if (state.user) {
        state.user = { ...state.user, ...action.payload.user };
      } else {
        state.user = action.payload.user;
      }
      state.loading = false;
    },
    updateProfileDataFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    updateProfileEmailSuc: (state, action) => {
      state.status = 'succeeded';
      if (state.user) {
        state.user = { ...state.user, ...action.payload.user };
      } else {
        state.user = action.payload.user;
      }
      state.loading = false;
    },
    updateProfileEmailFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    updateProfilePasswordSuc: (state) => {
      state.status = 'succeeded';
      state.loading = false;
    },
    updateProfilePasswordFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    updateProfilePhoneSuc: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload.user };
      } else {
        state.user = action.payload.user;
      }
      state.loading = false;
      state.status = 'succeeded';
    },
    updateProfilePhoneFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    requestPhoneChangeSuc: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      if (action.payload.message) {
        state.message = action.payload.message;
      }
    },
    requestPhoneChangeFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
    confirmPhoneChangeSuc: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      if (action.payload.message) {
        state.message = action.payload.message;
      }
    },
    confirmPhoneChangeFail: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error occurred';
      state.loading = false;
      if (state.isAuth && state.user) {
        state.user = { ...state.user };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(temporaryRegisterReq, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(completeRegistrationReq, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(requestPasswordChangeReq, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(confirmPasswordChangeReq, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadAvatarReq, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteAvatarReq, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loginReq, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserProfileReq, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(updateProfileDataReq, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(updateProfileEmailReq, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(updateProfilePasswordReq, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(updateProfilePhoneReq, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(requestPhoneChangeReq, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      })
      .addCase(confirmPhoneChangeReq, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
      });
  },
});

export const authReducer = authSlice.reducer;

interface RootState {
  auth: AuthState;
}

export const selectIsAuth = (state: RootState): boolean => {
  return state.auth.isAuth;
};

export const selectUserProfile = (state: RootState) => state.auth.user;

export const {
  logout,
  temporaryRegisterSuc,
  temporaryRegisterFail,
  fetchProfileDataReq,
  fetchProfileDataSuc,
  fetchProfileDataFail,
  completeRegistrationFail,
  completeRegistrationSuc,
  requestPasswordChangeSuc,
  requestPasswordChangeFail,
  confirmPasswordChangeSuc,
  confirmPasswordChangeFail,
  uploadAvatarSuc,
  uploadAvatarFail,
  deleteAvatarSuc,
  deleteAvatarFail,
  loginSuc,
  loginFail,
  getUserProfileSuc,
  getUserProfileFail,
  updateProfileDataSuc,
  updateProfileDataFail,
  updateProfileEmailSuc,
  updateProfileEmailFail,
  updateProfilePasswordSuc,
  updateProfilePasswordFail,
  updateProfilePhoneSuc,
  updateProfilePhoneFail,
  requestPhoneChangeSuc,
  requestPhoneChangeFail,
  confirmPhoneChangeSuc,
  confirmPhoneChangeFail,
} = authSlice.actions;
