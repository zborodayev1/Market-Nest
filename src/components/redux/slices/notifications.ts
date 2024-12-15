import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from '../../../axios'
import { AxiosError } from 'axios'

export interface Notification {
  _id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  title: string
  isRead: boolean
  productImageUrl?: string
  actionType?: 'created' | 'approved' | 'rejected' | 'info'
  createdAt: string
  productId: string
}

interface NotificationsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  notifications: Notification[]
  total: number
  totalPages: number
  page: number
  filter: string
}

const initialState: NotificationsState = {
  status: 'idle',
  error: null,
  notifications: [],
  total: 0,
  totalPages: 0,
  page: 1,
  filter: 'read',
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (
    { page, limit, filter }: { page: number; limit: number; filter: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(
        `/products/noti?page=${page}&limit=${limit}&filter=${filter}`
      )
      return data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to fetch notifications'
        )
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
  }
)

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/products/noti/${notificationId}`)
      return data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to mark notification as read'
        )
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
  }
)

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (
    {
      message,
      actionType,
      title,
      productId,
    }: {
      message: string
      actionType: string
      title?: string
      productId?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post('/products/noti', {
        message,
        actionType,
        title,
        productId,
      })
      return data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to create notification'
        )
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notif) => notif._id !== action.payload
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(
        fetchNotifications.fulfilled,
        (
          state,
          action: PayloadAction<{
            notifications: Notification[]
            total: number
            totalPages: number
          }>
        ) => {
          state.status = 'succeeded'
          state.notifications = action.payload.notifications
          state.total = action.payload.total
          state.totalPages = action.payload.totalPages
        }
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Something went wrong'
      })
      .addCase(
        markNotificationAsRead.fulfilled,
        (state, action: PayloadAction<Notification>) => {
          const index = state.notifications.findIndex(
            (notif) => notif._id === action.payload._id
          )
          if (index !== -1) {
            state.notifications[index].isRead = true
          }
        }
      )
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to mark as read'
      })
      .addCase(createNotification.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.status = 'succeeded'

        state.notifications = [...state.notifications, action.payload]
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to create notification'
      })
  },
})

export const notificationsReducer = notificationsSlice.reducer
