import { ArrowDownCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { depositFunds } from '../../../redux/slices/walletSlice';
import { AppDispatch } from '../../../redux/store';
import Input from '../../ui/input/Input';

export const DepositForm = ({ onCancel }: { onCancel: () => void }) => {
  const dispatch: AppDispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ amount: number }>({
    defaultValues: {
      amount: 0,
    },
    mode: 'all',
  });

  const onSubmit = async (values: { amount: number }) => {
    const amount = Number(values.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('amount', {
        type: 'manual',
        message: 'Please enter a valid amount',
      });
      return;
    }
    try {
      dispatch(depositFunds(amount));
    } catch (error) {
      console.error(error);
    }
    onCancel();
  };

  const isAmountError = errors.amount ? true : false;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="text"
            icon={<ArrowDownCircle size={18} />}
            register={register}
            isError={isAmountError}
            inputStyle="w-[430px] pl-5 py-2"
            placeholder="Deposit amount"
            sircleWidth={36}
            sircleHeight={36}
            sircleTop={2}
            sircleRight={2}
            sircleHeightActive={40}
            sircleWidthActive={40}
            iconRight={10}
            iconTop={10}
            isMinLength={true}
            registerMinLenghtValue={1}
            registerMinLenghtMessage="Deposit amount must be at least 1 character"
            registerMaxLenghtValue={40}
            registerMaxLenghtMessage="Deposit amount must be at max 40 characters"
            registerName="amount"
            registerReq="Deposit amount is required"
          />
          {errors.amount && (
            <p className="text-sm text-red-500 mt-1 ml-2">
              {errors.amount.message}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-black transition-colors duration-200 ease-in-out "
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white bg-[#3C8737] hover:bg-[#2B6128] rounded-full gap-2 flex py-2 px-4 transition-colors duration-200 ease-in-out"
          >
            Deposit
            <ArrowDownCircle />
          </button>
        </div>
      </form>
    </>
  );
};
