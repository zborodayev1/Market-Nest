import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  requestPhoneChangeReq,
  selectUserProfile,
} from '../../../../../../redux/slices/authSlice';
import { AppDispatch } from '../../../../../../redux/store';
import Input from '../../../../../ui/input/Input';

interface Formdata {
  phone?: string;
}
interface Props {
  setPPS: (state: 'default' | 'forgotPass' | 'code') => void;
}

export const ForgotPassForm = (props: Props) => {
  const userData = useSelector(selectUserProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setPPS } = props;

  const dispatch: AppDispatch = useDispatch();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formdata>({
    mode: 'onSubmit',
  });
  const isPhoneError = errors.phone ? true : false;

  const onSubmit = async (values: Formdata) => {
    try {
      setIsSubmitting(true);
      const payload = {
        phone: values.phone || '',
      };
      dispatch(requestPhoneChangeReq(payload));

      reset({ ...userData, ...values });

      setPPS('code');
    } catch (error) {
      console.error(error);

      if (error === 'Phone change code already sent') {
        setPPS('code');
      } else {
        setPPS('default');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-black mb-1';
  return (
    <motion.form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="">
          <label className={labelClasses} htmlFor="password">
            <Phone size={18} />
            <h1 className="mt-[2px] ml-1">New Phone Number</h1>
          </label>
          <Input
            type="text"
            icon={<Phone size={18} />}
            register={register}
            isError={isPhoneError}
            inputStyle="w-75 pl-5 py-2"
            placeholder="Phone"
            sircleWidth={36}
            sircleHeight={36}
            sircleTop={2}
            sircleRight={2}
            sircleHeightActive={40}
            sircleWidthActive={40}
            iconRight={10}
            iconTop={10}
            isMinLength={true}
            registerMinLenghtValue={8}
            registerMinLenghtMessage="Phone must be at least 8 characters"
            registerMaxLenghtValue={40}
            registerMaxLenghtMessage="Phone must be at max 40 characters"
            registerName="phone"
            registerReq="Phone is required"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 ml-2">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.99 }}
        className={` w-full p-2 mt-5 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out delay-50   `}
      >
        <motion.span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out delay-50 ">
          {isSubmitting ? 'Sending...' : 'Send code'}
        </motion.span>
      </motion.button>
    </motion.form>
  );
};
