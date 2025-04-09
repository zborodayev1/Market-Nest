import { Transaction } from './transactions.type';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  transactions: Transaction[];
  income: number;
  expenses: number;
}
