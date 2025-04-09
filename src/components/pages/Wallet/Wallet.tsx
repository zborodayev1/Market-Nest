import { CircularProgress } from '@mui/material';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CreditCard,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallet } from '../../../redux/slices/walletSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { Transaction } from '../../../redux/types/transactions.type';
import { DepositForm } from './DepositForm';
import { SendMoneyFrom } from './SendMoneyFrom';

export const WalletPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const status = useSelector((state: RootState) => state.wallet.status);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dropdown, setDropdown] = useState<{ state: string; open: boolean }>({
    state: '',
    open: false,
  });

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  const handleDeposit = () => {
    setDropdown({
      state: 'Deposit',
      open: !dropdown.open,
    });
  };
  const handleSendMoney = () => {
    setDropdown({
      state: 'SendMoney',
      open: !dropdown.open,
    });
  };

  return (
    <>
      <Helmet>
        <title>Market Nest - Wallet</title>
        <meta name="description" content="Welcome to Market Nest!" />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests"
        />
      </Helmet>
      <div className="min-h-screen bg-white text-black p-6">
        {status === 'loading' && (
          <div className="flex justify-center m-5">
            <CircularProgress color="inherit" />
          </div>
        )}
        {status === 'failed' && (
          <>
            <div className="flex justify-center gap-1 m-5">
              <p className="text-red-500">Failed to load wallet data</p>
            </div>
            <div className="flex justify-center">
              <button
                className="font-bold cursor-pointer text-lg"
                onClick={() => dispatch(fetchWallet())}
              >
                Retry
              </button>
            </div>
          </>
        )}

        <div className="max-w-4xl mx-auto">
          <div
            className={`flex items-center gap-2 mb-8 ${status === 'loading' || status === 'failed' ? 'absolute top-[125px]' : 'mt-0'}`}
          >
            <CreditCard className="w-8 h-8" />
            <h1 className="text-2xl font-bold">My Wallet</h1>
          </div>

          {status === 'succeeded' && (
            <>
              <div className="bg-gray-50 rounded-xl p-6 mb-6 shadow-sm">
                <p className="text-gray-600 mb-2">Total Balance</p>
                <h2 className="text-4xl font-bold">${wallet.wallet.balance}</h2>
                <div className="flex gap-2 mt-2">
                  <button ref={buttonRef} onClick={handleDeposit}>
                    <div className="text-white bg-[#3C8737] hover:bg-[#2B6128] rounded-full gap-2 flex py-2 px-4 transition-colors duration-200 ease-in-out">
                      Deposit
                      <ArrowDownCircle />
                    </div>
                  </button>
                  <button ref={buttonRef} onClick={handleSendMoney}>
                    <div className="text-black bg-gray-200 hover:bg-gray-300 rounded-full gap-2 flex py-2 px-4 transition-colors duration-200 ease-in-out">
                      Send Money
                      <ArrowUpCircle />
                    </div>
                  </button>
                </div>
                <div ref={dropdownRef}>
                  {dropdown.open && dropdown.state === 'Deposit' ? (
                    <DepositForm />
                  ) : (
                    dropdown.state === 'SendMoney' &&
                    dropdown.open && <SendMoneyFrom />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold">Income</h3>
                  </div>
                  {wallet.wallet.income ? (
                    <>
                      <p className="text-2xl font-bold text-green-700">
                        ${wallet.wallet.income}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        +
                        {(
                          (wallet.wallet.income / wallet.wallet.balance) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-green-700">$0</p>
                      <p className="text-sm text-green-600 mt-1">+0%</p>
                    </>
                  )}
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold">Expenses</h3>
                  </div>
                  {wallet.wallet.expenses ? (
                    <>
                      <p className="text-2xl font-bold text-red-700">
                        ${wallet.wallet.expenses}
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        -
                        {(
                          (wallet.wallet.expenses / wallet.wallet.balance) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-red-700">$0</p>
                      <p className="text-sm text-red-700 mt-1">-0%</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 p-6 border-b border-gray-200">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-semibold">Recent Transactions</h3>
                </div>

                <div className="divide-y divide-gray-200">
                  {wallet.wallet.transactions &&
                    wallet.wallet.transactions.length > 0 &&
                    wallet.wallet.transactions.map(
                      (transaction: Transaction, index: number) => (
                        <div
                          key={index}
                          className="p-6 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              {transaction.date}
                            </p>
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
                      )
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
