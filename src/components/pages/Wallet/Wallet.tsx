import { Dialog, Transition } from '@headlessui/react';
import { CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearTransactions,
  fetchTransactions,
  fetchWallet,
} from '../../../redux/slices/walletSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { DepositForm } from './DepositForm';
import { SendMoneyForm } from './SendMoneyForm';
import { Transactions } from './Transactions';

export const WalletPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const { status, error } = useSelector((state: RootState) => state.wallet);
  const hasMore = useSelector((state: RootState) => state.wallet.hasMore);
  const [page, setPage] = useState(1);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { ref, inView } = useInView();
  const [openDeposit, setOpenDeposit] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [openSendMoney, setOpenSendMoney] = useState(false);

  useEffect(() => {
    dispatch(fetchWallet());
  }, []);

  useEffect(() => {
    if (status !== 'loading') {
      dispatch(fetchTransactions({ page, limit: 10 }));
    }
  }, [dispatch, page]);

  useEffect(() => {
    if (inView && hasMore && status !== 'loading') {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, status]);

  const handleClearTransactions = () => {
    dispatch(clearTransactions());
    setIsClearConfirmOpen(false);
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-white text-black p-6"
      >
        {status === 'loading' && (
          <div className="flex justify-center m-5">
            <CircularProgress color="inherit" />
          </div>
        )}
        {status === 'failed' && (
          <>
            <div className="flex justify-center mt-10">
              <div className="w-100 bg-red-50 border-2 border-red-100 rounded-xl p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-700 mb-2">
                  {error}
                </h2>
                <button
                  onClick={() => dispatch(fetchWallet())}
                  className="bg-red-100 text-red-700 px-6 py-3 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
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
              <div className="flex justify-between bg-gray-50 rounded-xl p-6 mb-6 shadow-sm">
                <div className="">
                  <p className="text-gray-600 mb-2">Total Balance</p>
                  <h2 className="text-4xl font-bold">
                    ${wallet.wallet.balance}
                  </h2>
                </div>
                <div className="flex gap-2 mt-3">
                  <button ref={buttonRef} onClick={() => setOpenDeposit(true)}>
                    <div className="text-white bg-[#3C8737] hover:bg-[#2B6128] rounded-full gap-2 flex py-2 px-4 transition-colors duration-200 ease-in-out">
                      Deposit
                      <ArrowDownCircle />
                    </div>
                  </button>
                  <button
                    ref={buttonRef}
                    onClick={() => setOpenSendMoney(true)}
                  >
                    <div className="text-black bg-gray-200 hover:bg-gray-300 rounded-full gap-2 flex py-2 px-4 transition-colors duration-200 ease-in-out">
                      Send Money
                      <ArrowUpCircle />
                    </div>
                  </button>
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

              <Transactions
                onClearTransactions={() => setIsClearConfirmOpen(true)}
              />
            </>
          )}
        </div>
      </motion.div>
      <AnimatePresence>
        {openDeposit && (
          <Dialog
            open={openDeposit}
            onClose={() => setOpenDeposit(false)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h1 className="text-xl font-bold mb-4">Deposit Funds</h1>
                <DepositForm onCancel={() => setOpenDeposit(false)} />
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

      <Transition show={openSendMoney} as={React.Fragment}>
        <Dialog
          onClose={() => setOpenSendMoney(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h1 className="text-xl font-bold mb-4">Send Money</h1>
              <SendMoneyForm onCancel={() => setOpenSendMoney(false)} />
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition show={isClearConfirmOpen} as={React.Fragment}>
        <Dialog
          onClose={() => setIsClearConfirmOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h1 className="text-xl font-bold mb-4">Clear All Transactions</h1>
              <p className="text-gray-600 mb-6">
                Are you sure you want to clear all transactions? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsClearConfirmOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearTransactions}
                  className="text-white items-center bg-red-600 hover:bg-red-700 rounded-full gap-2 flex py-2 px-4 transition-colors duration-200 ease-in-out"
                >
                  Clear All
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div ref={ref} className="h-10" />
    </>
  );
};
