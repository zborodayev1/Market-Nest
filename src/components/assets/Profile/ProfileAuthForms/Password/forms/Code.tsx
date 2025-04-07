import { motion } from 'framer-motion';
import { Binary, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  confirmPasswordChangeReq,
  selectUserProfile,
} from '../../../../../../redux/slices/authSlice';
import { AppDispatch } from '../../../../../../redux/store';
import Input from '../../../../../ui/input/Input';

interface Formdata {
  verificationCode?: string;
}
interface Props {
  onSuccess: () => void;
  setPPS: (state: 'default' | 'forgotPass' | 'code') => void;
}

export const Code = (props: Props) => {
  const userData = useSelector(selectUserProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onSuccess, setPPS } = props;
  const dispatch: AppDispatch = useDispatch();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formdata>({
    mode: 'onSubmit',
  });

  const onSubmit = async (values: Formdata) => {
    try {
      setIsSubmitting(true);
      const payload = {
        verificationCode: values.verificationCode || '',
      };
      dispatch(confirmPasswordChangeReq(payload));

      reset({ ...userData, ...values });
      onSuccess();

      setPPS('default');
    } catch (error) {
      console.error(error);

      if (
        error === 'Password change code already sent' ||
        error === 'Invalid verification code'
      ) {
        setPPS('code');
      } else {
        setPPS('default');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const isCodeError = errors.verificationCode ? true : false;

  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-black mb-1';
  return (
    <motion.form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="">
          <label className={labelClasses} htmlFor="password">
            <Binary size={23} />
            <h1 className="mt-[2px] ml-1">Code</h1>
          </label>
          <Input
            type={showPassword ? 'text' : 'password'}
            icon={
              showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )
            }
            register={register}
            isError={isCodeError}
            inputStyle="w-75 pl-5 py-2"
            placeholder="Verification Code"
            sircleWidth={36}
            sircleHeight={36}
            sircleTop={2}
            sircleRight={2}
            sircleHeightActive={40}
            sircleWidthActive={40}
            iconRight={10}
            iconTop={10}
            registerName="verificationCode"
            registerReq="Verification Code is required"
            isMinLength={true}
            registerMinLenghtValue={6}
            registerMaxLenghtValue={6}
            registerMinLenghtMessage="Verification code must be 6 digits"
            registerMaxLenghtMessage="Verification code must be 6 digits"
            iconButtonOnCLick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.99 }}
        className={` w-full p-2 mt-5 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out  delay-50   `}
      >
        <motion.span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out  delay-50">
          {isSubmitting ? 'Verification...' : 'Verify'}
        </motion.span>
      </motion.button>
    </motion.form>
  );
};
