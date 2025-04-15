import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axios from '../../axios';
import { Transaction } from '../types/transactions.type';
import { Wallet } from '../types/wallet.type';

interface WalletState {
  wallet: Wallet | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  depositStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  sendMoneyStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  transactions: Transaction[];
  error: string | null;
  hasMore: boolean;
  totalTransactions: number;
}

const initialState: WalletState = {
  wallet: null,
  status: 'idle',
  depositStatus: 'idle',
  sendMoneyStatus: 'idle',
  transactions: [],
  error: null,
  hasMore: true,
  totalTransactions: 0,
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

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/wallet/transactions?page=${page}&limit=${limit}`
      );

      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to get transactions'
        );
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

export const clearTransactions = createAsyncThunk(
  'wallet/clearTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/wallet/transactions`);
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
  reducers: {
    setDepositStatus: (state, action) => {
      state.depositStatus = action.payload;
    },
    setSendMoneyStatus: (state) => {
      state.sendMoneyStatus = 'idle';
    },
  },
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
        state.error = (action.payload as string) || 'Failed to fetch wallet';
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = [
          ...state.transactions,
          ...action.payload.transactions,
        ];
        state.hasMore = action.payload.hasMore;
        state.totalTransactions = action.payload.totalTransactions;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to fetch wallet';
      })
      .addCase(depositFunds.pending, (state) => {
        state.depositStatus = 'loading';
        state.error = null;
      })
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.depositStatus = 'succeeded';
        state.wallet = action.payload;
        state.error = null;
      })
      .addCase(depositFunds.rejected, (state, action) => {
        state.depositStatus = 'failed';
        state.error = action.error.message ?? 'Failed to deposit funds';
      })
      .addCase(sendMoney.pending, (state) => {
        state.sendMoneyStatus = 'loading';
        state.error = null;
      })
      .addCase(sendMoney.fulfilled, (state, action) => {
        state.sendMoneyStatus = 'succeeded';
        state.wallet = action.payload;
        state.error = null;
      })
      .addCase(sendMoney.rejected, (state, action) => {
        state.sendMoneyStatus = 'failed';
        state.error = action.error.message ?? 'Failed to send money';
      })
      .addCase(clearTransactions.pending, (state) => {
        state.error = null;
      })
      .addCase(clearTransactions.fulfilled, (state) => {
        state.transactions = [];
        state.hasMore = true;
        state.totalTransactions = 0;
        state.error = null;
      })
      .addCase(clearTransactions.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to clear transactions';
      });
  },
});

export const walletReducer = walletSlice.reducer;

export const { setDepositStatus, setSendMoneyStatus } = walletSlice.actions;
