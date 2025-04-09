import { motion } from 'framer-motion';
import { Eye, EyeOff, RectangleEllipsis } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  selectUserProfile,
  updateProfilePasswordReq,
} from '../../../../../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import Input from '../../../../../ui/input/Input';

interface Formdata {
  password?: string;
  newPassword?: string;
}
interface Props {
  onSuccess: () => void;
}
export const DefForm = (props: Props) => {
  const userData = useSelector(selectUserProfile);
  const err = useSelector((state: RootState) => state.auth.error);
  const status = useSelector((state: RootState) => state.auth.status);
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

  const onSubmit = async (values: Formdata) => {
    try {
      setIsSubmitting(true);

      const payload = {
        oldPassword: values.password || '',
        password: values.newPassword || '',
      };

      dispatch(updateProfilePasswordReq(payload));

      reset({ ...userData, ...values });
      onSuccess();
      if (status === 'failed') {
        toast(err, {
          type: 'error',
          position: 'bottom-right',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const isPasswordError = errors.password ? true : false;
  const isNewPasswordError = errors.newPassword ? true : false;

  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-black mb-1';
  return (
    <motion.form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="">
          <label className={labelClasses} htmlFor="password">
            <RectangleEllipsis size={23} />
            <h1 className="mt-[2px] ml-1">Old Password</h1>
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
            placeholder="Old Password"
            sircleWidth={36}
            sircleHeight={36}
            sircleTop={2}
            sircleRight={2}
            sircleHeightActive={40}
            sircleWidthActive={40}
            iconRight={10}
            iconTop={10}
            registerName="password"
            registerReq="Old Password is required"
            isMinLength={true}
            registerMinLenghtValue={8}
            registerMinLenghtMessage="Old Password must be at least 8 characters"
            registerMaxLenghtValue={40}
            registerMaxLenghtMessage="Old Password must be at max 40 characters"
            iconButtonOnCLick={() => setShowPassword(!showPassword)}
          />
          {errors.password && (
            <p className="text-sm text-red-500 ml-2">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="">
          <label className={labelClasses} htmlFor="password">
            <RectangleEllipsis size={23} />
            <h1 className="mt-[2px] ml-1">New Password</h1>
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
            isError={isNewPasswordError}
            inputStyle="w-75 pl-5 py-2"
            placeholder="New Password"
            sircleWidth={36}
            sircleHeight={36}
            sircleTop={2}
            sircleRight={2}
            sircleHeightActive={40}
            sircleWidthActive={40}
            iconRight={10}
            iconTop={10}
            registerName="newPassword"
            registerReq="New Password is required"
            isMinLength={true}
            registerMinLenghtValue={8}
            registerMinLenghtMessage="New Password must be at least 8 characters"
            registerMaxLenghtValue={40}
            registerMaxLenghtMessage="New Password must be at max 40 characters"
            iconButtonOnCLick={() => setShowPassword(!showPassword)}
          />
          {errors.newPassword && (
            <p className="text-sm text-red-500 ml-2">
              {errors.newPassword.message}
            </p>
          )}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.99 }}
        className={` w-full p-2 mt-5 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] transition-colors duration-300 ease-in-out delay-50    `}
      >
        <motion.span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out  delay-50 ">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </motion.span>
      </motion.button>
    </motion.form>
  );
};
