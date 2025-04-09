import TransactionModel from '../../models/transaction.js';
import WalletModel from '../../models/wallet.js';

export const addTransaction = async (walletId, amount, type, description) => {
  const wallet = await WalletModel.findById(walletId);

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  const transaction = new TransactionModel({
    amount,
    type,
    description,
    wallet: walletId,
  });

  await transaction.save();

  wallet.transactions.push(transaction);

  if (type === 'income') {
    wallet.balance += amount;
    wallet.income += amount;
  } else if (type === 'expense') {
    wallet.balance -= amount;
    wallet.expenses += amount;
  }

  await wallet.save();
};
