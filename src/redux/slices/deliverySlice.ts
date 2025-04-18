import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Delivery } from '../types/delivery.type';

interface DeliveryState {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
}

const initialState: DeliveryState = {
  deliveries: [],
  loading: false,
  error: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    fetchDeliveryReq(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDeliverySuc(state, action: PayloadAction<Delivery[]>) {
      state.loading = false;
      state.deliveries = action.payload;
    },
    fetchDeliveryFail(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const deliveryReducer = deliverySlice.reducer;

interface RootState {
  delivery: DeliveryState;
}

export const { fetchDeliveryReq, fetchDeliverySuc, fetchDeliveryFail } =
  deliverySlice.actions;

export const selectDeliveries = (state: RootState) => state.delivery.deliveries;
