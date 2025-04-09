export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description: string;
  transactionId: string;
  walletId: string;
}
