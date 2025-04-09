import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
    income: {
      type: Number,
      default: 0,
    },
    expenses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Wallet', WalletSchema);
