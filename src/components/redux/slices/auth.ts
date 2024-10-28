/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '../../../axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface AuthResponse {
  token: string
  user: UserProfile
}

interface UpdateProfileResponse {
  user: UserProfile
}

interface UserProfile {
  fullName: string
  avatarUrl: string
  phone: string
  address: string
  city: string
  country: string
  email: string
  password: string
}

interface AuthState {
  user: UserProfile | null
  isAuth: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export const fetchRegister = createAsyncThunk<
  AuthResponse,
  { fullName: string; email: string; password: string }
>(
  'auth/fetchRegister',
  async (params: {
    fullName: string
    email: string
    password: string
  }): Promise<any> => {
    const { data } = await axios.post('/auth/register', params)
    return data
  }
)

export const fetchLogin = createAsyncThunk<
  AuthResponse,
  { email: string; password: string }
>(
  'auth/fetchLogin',
  async (params: { email: string; password: string }): Promise<any> => {
    const { data } = await axios.post('/auth/login', params)
    return data
  }
)

export const updateProfile = createAsyncThunk<
  UpdateProfileResponse,
  UserProfile
>('auth/updateProfile', async (params) => {
  const { data } = await axios.patch('/profile', params)
  return data
})

export const fetchProfileData = createAsyncThunk<UserProfile>(
  'auth/fetchProfileData',
  async () => {
    const { data } = await axios.get('/profile')
    return data
  }
)

export const deleteProfile = createAsyncThunk(
  'auth/deleteProfile',
  async () => {
    await axios.delete('/profile')
  }
)

const initialState: AuthState = {
  user: null,
  isAuth: false,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuth = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.status = 'loading'
      state.error = null
    }
    const handleFulfilled = (state: AuthState, action: any) => {
      state.status = 'succeeded'
      state.user = action.payload
      state.isAuth = true
      state.error = null
    }
    const handleRejected = (state: AuthState, action: any) => {
      state.status = 'failed'
      state.user = null
      state.error = action.payload || 'Ошибка при выполнении запроса'
    }

    builder
      .addCase(fetchRegister.pending, handlePending)
      .addCase(fetchRegister.fulfilled, handleFulfilled)
      .addCase(fetchRegister.rejected, handleRejected)
      .addCase(fetchLogin.pending, handlePending)
      .addCase(fetchLogin.fulfilled, handleFulfilled)
      .addCase(fetchLogin.rejected, handleRejected)
      .addCase(fetchProfileData.pending, handlePending)
      .addCase(fetchProfileData.fulfilled, handleFulfilled)
      .addCase(fetchProfileData.rejected, handleRejected)
      .addCase(updateProfile.pending, handlePending)
      .addCase(updateProfile.fulfilled, handleFulfilled)
      .addCase(updateProfile.rejected, handleRejected)
      .addCase(deleteProfile.pending, handlePending)
      .addCase(deleteProfile.fulfilled, (state) => {
        state.user = null
        state.isAuth = false
        state.error = null
      })
      .addCase(deleteProfile.rejected, handleRejected)
  },
})

export const authReducer = authSlice.reducer

export interface RootState {
  auth: AuthState
}

export const selectIsAuth = (state: RootState): boolean => {
  return state.auth.isAuth
}

export const selectUserProfile = (state: RootState) => state.auth.user

export const { logout } = authSlice.actions
