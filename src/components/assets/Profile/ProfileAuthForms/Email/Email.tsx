import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Mail, RectangleEllipsis } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserProfile,
  updateProfileEmailReq,
} from '../../../../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../../../../redux/store';
import Input from '../../../../ui/input/Input';

interface Formdata {
  email?: string;
  password?: string;
}
interface Props {
  onSuccess: () => void;
}
export const Email = (props: Props) => {
  const userData = useSelector(selectUserProfile);
  const error = useSelector((state: RootState) => state.auth.error);
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

      dispatch(
        updateProfileEmailReq({
          email: values.email ?? '',
          password: values.password ?? '',
        })
      );

      reset({ ...userData, ...values });
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const isEmailError = errors.email ? true : false;
  const isPasswordError = errors.password ? true : false;

  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-black mb-1';

  return (
    <AnimatePresence>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md mx-auto p-6 bg-[#fff] border-[2px] border-[#212121]   rounded-xl shadow-lg space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>
              <Mail size={18} /> New E-mail
            </label>
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
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.99 }}
          className={` w-[340px] p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]   transition-all duration-300 ease-in-out delay-50    `}
        >
          <motion.span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out   ">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </motion.span>
        </motion.button>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center mt-2"
          >
            {error}
          </motion.p>
        )}
      </motion.form>
    </AnimatePresence>
  );
};
