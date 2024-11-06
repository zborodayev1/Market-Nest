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
  avatarUrl?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  email: string
  password: string
}

interface UserData {
  fullName: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

interface UserPassword {
  oldPassword: string
  password: string
}

interface UserEmail {
  email: string
  password: string
}

interface AuthState {
  user: UserProfile | null
  isAuth: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  loading: boolean
}

export const fetchRegister = createAsyncThunk<
  AuthResponse,
  { fullName: string; email: string; password: string }
>('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/auth/register', params)
  return data
})

export const fetchLogin = createAsyncThunk<
  AuthResponse,
  { email: string; password: string }
>('auth/fetchLogin', async (params) => {
  const { data } = await axios.post('/auth/login', params)
  return data
})
export const fetchProfileData = createAsyncThunk<UserProfile>(
  'auth/fetchProfileData',
  async () => {
    const { data } = await axios.get('/profile')
    return data
  }
)

export const updateProfileData = createAsyncThunk<
  UpdateProfileResponse,
  UserData,
  { rejectValue: string }
>('auth/updateProfile', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch('/profile/data', params)
    return data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue('Error while updating profile')
  }
})

export const updateProfileEmail = createAsyncThunk<
  UpdateProfileResponse,
  UserEmail,
  { rejectValue: string }
>('auth/updateProfileEmail', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch('/profile/email', params)
    return data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue('Error while updating profile')
  }
})

export const updateProfilePassword = createAsyncThunk<
  UpdateProfileResponse,
  UserPassword,
  { rejectValue: string }
>('auth/updateProfilePassword', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch('/profile/password', params)
    return data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return rejectWithValue('Error while updating profile')
  }
})
const initialState: AuthState = {
  user: null,
  isAuth: false,
  status: 'idle',
  error: null,
  loading: false,
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
      if (!state.loading) {
        state.loading = true
        state.status = 'loading'
        state.error = null
      } else {
        state.error = 'Second request in progress!'
      }
    }
    const handleFulfilled = (state: AuthState, action: any) => {
      state.status = 'succeeded'
      state.user = action.payload.user || (action.payload as UserProfile)
      state.isAuth = true
      state.error = null
      state.loading = false
    }
    const handleRejected = (state: AuthState, action: any) => {
      state.status = 'failed'
      state.error = action.payload || 'Error occurred'
      state.loading = false
      if (state.isAuth && state.user) {
        state.user = { ...state.user }
      }
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
      .addCase(updateProfileData.pending, handlePending)
      .addCase(updateProfileData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (state.user) {
          state.user = { ...state.user, ...action.payload.user }
        } else {
          state.user = action.payload.user
        }
        state.loading = false
      })
      .addCase(updateProfileData.rejected, handleRejected)
      .addCase(updateProfileEmail.pending, handlePending)
      .addCase(updateProfileEmail.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (state.user) {
          state.user = { ...state.user, ...action.payload.user }
        } else {
          state.user = action.payload.user
        }
        state.loading = false
      })
      .addCase(updateProfileEmail.rejected, handleRejected)
      .addCase(updateProfilePassword.pending, handlePending)
      .addCase(updateProfilePassword.fulfilled, (state) => {
        state.status = 'succeeded'
        state.loading = false
      })
      .addCase(updateProfilePassword.rejected, handleRejected)
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
