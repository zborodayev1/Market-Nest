import { motion } from 'framer-motion';
import { Eye, EyeOff, Phone, RectangleEllipsis } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserProfile,
  updateProfilePhoneReq,
} from '../../../../../../redux/slices/authSlice';
import { AppDispatch } from '../../../../../../redux/store';
import Input from '../../../../../ui/input/Input';

interface Formdata {
  password?: string;
  phone?: string;
}
interface Props {
  onSuccess: () => void;
}
export const DefForm = (props: Props) => {
  const userData = useSelector(selectUserProfile);

  const [formValues, setFormValues] = useState<Formdata>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onSuccess } = props;
  const dispatch: AppDispatch = useDispatch();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formdata>({
    mode: 'onSubmit',
  });

  const onSubmit = (values: Formdata) => {
    try {
      setIsSubmitting(true);
      setFormValues(values);
      const payload = {
        password: values.password || '',
        phone: values.phone || '',
      };

      dispatch(updateProfilePhoneReq(payload));

      reset({ ...userData, ...formValues });
      onSuccess();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const isPasswordError = errors.password ? true : false;
  const isPhoneError = errors.phone ? true : false;

  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-black mb-1';
  return (
    <motion.form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="">
          <label className={labelClasses} htmlFor="password">
            <RectangleEllipsis size={23} />
            <h1 className="mt-[2px] ml-1">Password</h1>
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
            isError={isPasswordError}
            inputStyle="w-75 pl-5 py-2"
            placeholder="Password"
            sircleWidth={36}
            sircleHeight={36}
            sircleTop={2}
            sircleRight={2}
            sircleHeightActive={40}
            sircleWidthActive={40}
            iconRight={10}
            iconTop={10}
            registerName="password"
            registerReq="Password is required"
            isMinLength={true}
            registerMinLenghtValue={8}
            registerMinLenghtMessage="Password must be at least 8 characters"
            registerMaxLenghtValue={40}
            registerMaxLenghtMessage="Password must be at max 40 characters"
            iconButtonOnCLick={() => setShowPassword(!showPassword)}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1 ml-2">
              {errors.password.message}
            </p>
          )}
        </div>

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
        className={` w-full p-2 mt-5 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out  delay-50  `}
      >
        <motion.span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out  ">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </motion.span>
      </motion.button>
    </motion.form>
  );
};
