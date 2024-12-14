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
  actionType?: 'created' | 'updated' | 'deleted'
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
}

const initialState: NotificationsState = {
  status: 'idle',
  error: null,
  notifications: [],
  total: 0,
  totalPages: 0,
  page: 1,
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(
        `/products/noti?page=${page}&limit=${limit}`
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

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.notifications = []
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

          state.notifications = [
            ...action.payload.notifications,
            ...state.notifications,
          ]
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
  },
})

export const notificationsReducer = notificationsSlice.reducer
