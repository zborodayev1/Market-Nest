import { Clock, Trash2 } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Transaction } from '../../../redux/types/transactions.type';

interface Props {
  onClearTransactions?: () => void;
}

export const Transactions: React.FC<Props> = ({ onClearTransactions }) => {
  const transactions = useSelector(
    (state: RootState) => state.wallet.transactions
  );

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between  p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <h3 className="font-semibold">Recent Transactions</h3>
          </div>
          <button
            onClick={onClearTransactions}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer transition-colors duration-200 ease-in-out"
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction: Transaction, index: number) => (
              <div
                key={index}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <p
                  className={`font-medium ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 font-bold">No Transactions yet</div>
          )}
        </div>
      </div>
    </div>
  );
};
