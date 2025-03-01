import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface CacheItem<T = unknown> {
  isChange: boolean
  data: T
}

interface CacheState {
  products: {
    fetchProducts: CacheItem
    fetchPendingProducts: CacheItem
  }
  noti: {
    fetchNotifications: CacheItem
  }
  auth: {
    profile: CacheItem
  }
  unreadCount: {
    unread: CacheItem
  }
  error: string | null
}

const initialState: CacheState = {
  products: {
    fetchProducts: { isChange: false, data: null },
    fetchPendingProducts: { isChange: false, data: null },
  },
  noti: {
    fetchNotifications: { isChange: false, data: null },
  },
  auth: {
    profile: { isChange: false, data: null },
  },
  unreadCount: {
    unread: { isChange: false, data: null },
  },
  error: null,
}

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    updateFetchProducts: (
      state,
      action: PayloadAction<{ data: unknown; isChange: boolean }>
    ) => {
      state.products.fetchProducts.data = action.payload.data
      state.products.fetchProducts.isChange = action.payload.isChange
    },
    updateFetchPendingProducts: (
      state,
      action: PayloadAction<{ data: unknown; isChange: boolean }>
    ) => {
      state.products.fetchPendingProducts.data = action.payload.data
      state.products.fetchPendingProducts.isChange = action.payload.isChange
    },
    updateFetchNotifications: (
      state,
      action: PayloadAction<{ data: unknown; isChange: boolean }>
    ) => {
      state.noti.fetchNotifications.data = action.payload.data
      state.noti.fetchNotifications.isChange = action.payload.isChange
    },
    updateProfile: (
      state,
      action: PayloadAction<{ data: unknown; isChange: boolean }>
    ) => {
      state.auth.profile.data = action.payload.data
      state.auth.profile.isChange = action.payload.isChange
    },
    updateUnread: (
      state,
      action: PayloadAction<{ data: unknown; isChange: boolean }>
    ) => {
      state.unreadCount.unread.data = action.payload.data
      state.unreadCount.unread.isChange = action.payload.isChange
    },
    resetCache: () => initialState,
  },
})

export const {
  updateFetchProducts,
  updateFetchPendingProducts,
  updateFetchNotifications,
  updateProfile,
  updateUnread,
  resetCache,
} = cacheSlice.actions

export const cacheReducer = cacheSlice.reducer

// Селекторы
export const selectFetchProducts = (state: RootState) =>
  state.cache.products.fetchProducts
export const selectFetchPendingProducts = (state: RootState) =>
  state.cache.products.fetchPendingProducts
export const selectFetchNotifications = (state: RootState) =>
  state.cache.noti.fetchNotifications
export const selectProfile = (state: RootState) => state.cache.auth.profile
export const selectUnread = (state: RootState) => state.cache.unreadCount.unread
