import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axios from '../../axios';
import { Wallet } from '../types/wallet.type';

interface WalletState {
  wallet: Wallet | null;

  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WalletState = {
  wallet: null,

  status: 'idle',
  error: null,
};

export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/wallet`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Failed to get wallet');
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

export const depositFunds = createAsyncThunk(
  'wallet/depositFunds',
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/wallet/deposit`, { amount });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to deposit funds'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const sendMoney = createAsyncThunk(
  'wallet/sendMoney',
  async (
    transaction: { amount: number; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/wallet/send`, transaction);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Failed to send money');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
        state.error = null;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch wallet';
      })
      .addCase(depositFunds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
        state.error = null;
      })
      .addCase(depositFunds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to deposit funds';
      })
      .addCase(sendMoney.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendMoney.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
        state.error = null;
      })
      .addCase(sendMoney.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to send money';
      });
  },
});

export const walletReducer = walletSlice.reducer;
