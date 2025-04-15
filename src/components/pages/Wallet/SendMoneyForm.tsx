import { ArrowDownCircle, ArrowUpCircle, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { sendMoney } from '../../../redux/slices/walletSlice';
import { AppDispatch } from '../../../redux/store';
import Input from '../../ui/input/Input';

export const SendMoneyForm = ({ onCancel }: { onCancel: () => void }) => {
  const dispatch: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ amount: number; email: string }>({
    defaultValues: {
      amount: 0,
      email: '',
    },
    mode: 'all',
  });

  const onSubmit = async (values: { amount: number; email: string }) => {
    try {
      dispatch(sendMoney(values));
    } catch (error) {
      console.error(error);
    }
  };

  const isAmountError = errors.amount ? true : false;
  const isEmailError = errors.email ? true : false;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="mb-2">
            <Input
              type="text"
              icon={<ArrowDownCircle size={18} />}
              register={register}
              isError={isAmountError}
              inputStyle="w-[430px] pl-5 py-2 "
              placeholder="Money to send"
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
              registerMinLenghtMessage="Money to send must be at least 1 character"
              registerMaxLenghtValue={40}
              registerMaxLenghtMessage="Money to send must be at max 40 characters"
              registerName="amount"
              registerReq="Money to send is required"
            />

            {errors.amount && (
              <p className="text-sm text-red-500 mt-1 ml-2">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div>
            <Input
              type="email"
              icon={<Mail size={18} />}
              register={register}
              isError={isEmailError}
              inputStyle="w-75 pl-5 py-2"
              placeholder="Email"
              sircleWidth={36}
              sircleHeight={36}
              sircleTop={2}
              sircleRight={2}
              sircleHeightActive={40}
              sircleWidthActive={40}
              iconRight={10}
              iconTop={10}
              registerName="email"
              registerReq="Email is required"
              registerMaxLenghtValue={40}
              registerMaxLenghtMessage="Email must be at max 40 characters"
              isPattern={true}
              registerPatternMessage="Invalid email address"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1 ml-2">
                {errors.email.message}
              </p>
            )}
          </div>
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
            className="text-black bg-gray-200 hover:bg-gray-300 rounded-full gap-2 flex py-2 px-4 transition-colors duration-200 ease-in-out"
          >
            Send Money
            <ArrowUpCircle />
          </button>
        </div>
      </form>
    </>
  );
};
