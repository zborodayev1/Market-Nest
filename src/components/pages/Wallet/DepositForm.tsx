import { ArrowDownCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { depositFunds } from '../../../redux/slices/walletSlice';
import { AppDispatch } from '../../../redux/store';
import Input from '../../ui/input/Input';

export const DepositForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ amount: number }>({
    defaultValues: {
      amount: 0,
    },
    mode: 'all',
  });

  const onSubmit = async (values: { amount: number }) => {
    try {
      dispatch(depositFunds(values.amount));
    } catch (error) {
      console.error(error);
    }
  };

  const isAmountError = errors.amount ? true : false;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-200 w-75 mt-2 rounded-md p-4"
      >
        <div className="flex gap-1">
          <h1 className="ml-5 font-bold mb-2">Deposit</h1>
          <ArrowDownCircle className="mt-[3px]" size={20} />
        </div>
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
        <button
          className={`mt-5 w-full p-2  rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out delay-50`}
        >
          Send Deposit
        </button>
      </form>
    </>
  );
};
