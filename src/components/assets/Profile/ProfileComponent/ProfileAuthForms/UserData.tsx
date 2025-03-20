import { AnimatePresence, motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  RootState,
  selectUserProfile,
  updateProfileDataReq,
} from '../../../../../redux/slices/authSlice';
import { AppDispatch } from '../../../../../redux/store';
import { AddressPicker } from '../../../functons/address/AddressPicker';

interface FormData {
  fullName?: string;
  phone?: string;
  address?: string;
}

interface Props {
  onSuccess: () => void;
}

export const UserData = ({ onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userData = useSelector(selectUserProfile);
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);
  const dispatch: AppDispatch = useDispatch();
  const [address, setAddress] = useState<string>('');
  const [coordinates, setCoordinates] = useState<[number, number]>([
    45.02626419993138, 78.38643193244936,
  ]);
  const {
    register,
    handleSubmit,

    reset,
  } = useForm<FormData>({
    defaultValues: {
      fullName: userData?.fullName || '',
      address: userData?.address || '',
    },
  });

  const onSubmit = (values: FormData) => {
    try {
      setIsSubmitting(true);
      dispatch(updateProfileDataReq(values));

      if (status === 'succeeded') {
        reset({ ...userData, ...values });
        onSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-2 bg-[#fff] border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] focus:border-transparent transition-all duration-200 ';
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-black  mb-1';

  return (
    <AnimatePresence>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md mx-auto p-6 bg-[#fff] border-[2px] border-[#212121]  rounded-xl shadow-lg space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>
              <User size={18} /> Full Name
            </label>
            <input
              {...register('fullName')}
              className={inputClasses}
              placeholder="John Doe"
              spellCheck="false"
            />
          </div>

          <AddressPicker
            address={address}
            setAddress={setAddress}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.99 }}
          className={` w-full p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out    `}
        >
          <motion.span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out group-hover:text-white  ">
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
