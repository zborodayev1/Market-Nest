import dayjs from 'dayjs';
import mongoose from 'mongoose';
import NotiModel from '../models/noti.js';
import UserModel from '../models/user.js';
import WalletModel from '../models/wallet.js';
import { addTransaction } from '../utils/functions/addTransaction.js';

export const getWallet = async (req, res) => {
  const userId = req.userId;
  try {
    const wallet = await WalletModel.findOne({ user: userId }).populate(
      'transactions'
    );

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    const formattedTransactions = wallet.transactions.map((tx) => ({
      ...tx.toObject(),
      date: dayjs(tx.date).format('YYYY-MM-DD HH:mm'),
    }));

    const formattedWallet = {
      ...wallet.toObject(),
      transactions: formattedTransactions,
    };

    return res.status(200).json(formattedWallet);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to retrieve wallet' });
  }
};

export const depositFunds = async (req, res) => {
  const userId = req.userId;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const wallet = await WalletModel.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: amount, income: amount } },
      { new: true }
    );

    addTransaction(wallet._id, amount, 'income', `Deposited funds`);

    await NotiModel.create({
      userId: req.userId,
      actionType: 'order',
      title: `Funds have been credited to your account - $${amount}`,
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    return res.status(200).json(wallet);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to deposit funds' });
  }
};

export const sendMoney = async (req, res) => {
  const userId = req.userId;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }
    const recipientId = user._id;
    const senderWallet = await WalletModel.findOne({ user: userId })
      .session(session)
      .populate('user', 'fullName');
    const recipientWallet = await WalletModel.findOne({
      user: recipientId,
    })
      .session(session)
      .populate('user', 'fullName');

    if (!senderWallet || !recipientWallet) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (senderWallet.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    addTransaction(
      senderWallet._id,
      amount,
      'expense',
      `Send money to ${recipientWallet.user.fullName}`
    );

    senderWallet.balance -= amount;
    senderWallet.expenses += amount;
    addTransaction(
      recipientWallet._id,
      amount,
      'income',
      `Received money from ${senderWallet.user.fullName}`
    );
    recipientWallet.balance += amount;
    recipientWallet.income += amount;

    await senderWallet.save({ session });
    await recipientWallet.save({ session });

    await NotiModel.create({
      userId: req.userId,
      actionType: 'order',
      title: `Funds have been send - $${amount} to ${recipientWallet.user.fullName}`,
    });
    await NotiModel.create({
      userId: recipientId,
      actionType: 'order',
      title: `Funds have been credited to your account - $${amount} from ${senderWallet.user.fullName}`,
    });

    await session.commitTransaction();

    return res.status(200).json({
      wallet: senderWallet,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return res.status(500).json({ message: 'Failed to send money' });
  } finally {
    session.endSession();
  }
};
