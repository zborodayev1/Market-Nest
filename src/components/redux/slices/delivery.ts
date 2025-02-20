import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import axios from '../../../axios'

export interface Delivery {
  name: string
  desc?: string
  price: number
  time: number
}

interface DeliveryResponse {
  deliveries: Delivery[] | []
}

interface DeliveryState {
  deliveries: Delivery[]
  loading: boolean
  error: string | null
}

const initialState: DeliveryState = {
  deliveries: [],
  loading: false,
  error: null,
}

export const getDelivery = createAsyncThunk(
  'products/getDelivery',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<DeliveryResponse>('/del')
      return data.deliveries
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Failed to get delivery')
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
  }
)

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDelivery.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDelivery.fulfilled, (state, action) => {
        state.loading = false
        state.deliveries = action.payload
      })
      .addCase(getDelivery.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const deliveryReducer = deliverySlice.reducer

export const selectDeliveries = (state: { delivery: DeliveryState }) =>
  state.delivery.deliveries
