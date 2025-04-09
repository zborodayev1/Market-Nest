import { ArrowUpCircle, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { sendMoney } from '../../../redux/slices/walletSlice';
import { AppDispatch } from '../../../redux/store';
import Input from '../../ui/input/Input';

export const SendMoneyFrom = () => {
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-200 w-75 mt-2 rounded-md p-4"
      >
        <div className="flex gap-1">
          <h1 className="ml-2 font-bold mb-2">Send Money</h1>
          <ArrowUpCircle className="mt-[3px]" size={20} />
        </div>
        <Input
          type="text"
          icon={<ArrowUpCircle size={18} />}
          register={register}
          isError={isAmountError}
          inputStyle="w-[430px] pl-5 py-2"
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
          registerMinLenghtMessage="Money amount must be at least 1 character"
          registerMaxLenghtValue={40}
          registerMaxLenghtMessage="Money amount must be at max 40 characters"
          registerName="amount"
          registerReq="Money amount is required"
        />
        {errors.amount && (
          <p className="text-sm text-red-500 mt-1 ml-2">
            {errors.amount.message}
          </p>
        )}
        <div className="flex mt-2 gap-1">
          <h1 className="ml-2 font-bold mb-2">Email</h1>
          <Mail className="mt-[2px]" size={20} />
        </div>
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
        <button
          className={`mt-5 w-full p-2  rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out delay-50`}
        >
          Send Money
        </button>
      </form>
    </>
  );
};
