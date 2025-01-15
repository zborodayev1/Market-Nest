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
  _id: string
  fullName?: string
  avatarUrl?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  email?: string
  password?: string
  role?: string
}

interface UserData {
  fullName?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

interface UserPassword {
  oldPassword: string
  password: string
}

export interface UserEmail {
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

export const fetchTemporaryRegister = createAsyncThunk<
  { message: string },
  {
    fullName: string
    email: string
    password: string
    phone: string
    address: string
    city: string
    country: string
  },
  { rejectValue: string }
>('auth/fetchTemporaryRegister', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/auth/temporary-register', params)
    return data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred'

    return rejectWithValue(errorMessage)
  }
})

export const fetchCompleteRegistration = createAsyncThunk<
  { message: string; token: string },
  { email: string; code: string },
  { rejectValue: string }
>('auth/fetchCompleteRegistration', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/auth/complete-register', params)
    return data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred'
    return rejectWithValue(errorMessage)
  }
})

export const uploadImage = createAsyncThunk<
  { avatarUrl: string },
  FormData,
  { rejectValue: string }
>('user/uploadImage', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred'

    return rejectWithValue(errorMessage)
  }
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
    const { data } = await axios.get('/auth/profile')
    return data
  }
)

export const updateProfileData = createAsyncThunk<
  UpdateProfileResponse,
  UserData,
  { rejectValue: string }
>('auth/updateProfile', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch('/auth/profile/data', params)
    return data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred'

    return rejectWithValue(errorMessage)
  }
})

export const updateProfileEmail = createAsyncThunk<
  UpdateProfileResponse,
  UserEmail,
  { rejectValue: string }
>('auth/updateProfileEmail', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch('/auth/profile/email', params)
    return data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred'

    return rejectWithValue(errorMessage)
  }
})

export const updateProfilePassword = createAsyncThunk<
  UpdateProfileResponse,
  UserPassword,
  { rejectValue: string }
>('auth/updateProfilePassword', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch('/auth/profile/password', params)
    return data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred'

    return rejectWithValue(errorMessage)
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
      .addCase(fetchTemporaryRegister.pending, handlePending)
      .addCase(
        fetchTemporaryRegister.fulfilled,
        (state: AuthState, action: any) => {
          state.status = 'succeeded'
          state.user = action.payload.user || (action.payload as UserProfile)
          state.error = null
          state.loading = false
        }
      )
      .addCase(fetchTemporaryRegister.rejected, handleRejected)
      .addCase(fetchCompleteRegistration.pending, handlePending)
      .addCase(fetchCompleteRegistration.fulfilled, handleFulfilled)
      .addCase(fetchCompleteRegistration.rejected, handleRejected)
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
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true
        state.status = 'loading'
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatarUrl = action.payload.avatarUrl
        }
        state.loading = false
        state.status = 'succeeded'
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.payload || 'Error while update avatar'
      })
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
