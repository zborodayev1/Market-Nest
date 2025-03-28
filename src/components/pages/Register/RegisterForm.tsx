import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  RectangleEllipsis,
  User,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth/useAuth';
import { temporaryRegisterReq } from '../../../redux/slices/authSlice';
import { AppDispatch } from '../../../redux/store';
import { AddressPicker } from '../../assets/functons/Address/AddressPicker';

interface Props {
  setLoading: (loading: boolean) => void;
  setErr: (value: string) => void;
  loading: boolean;
  code: boolean;
  onSuccess: () => void;
}

export const RegisterForm = (props: Props) => {
  const inputClasses =
    ' px-5 py-2 w-[300px] h-[50px] bg-[#fff] border border-[#212121]  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] focus:border-transparent transition-all duration-200 ';
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-[#212121] mb-1';

  const [address, setAddress] = useState<string>('');
  const [coordinates, setCoordinates] = useState<[number, number]>([
    45.02626419993138, 78.38643193244936,
  ]);
  const { setLoading, setErr, loading, onSuccess } = props;
  const dispatch: AppDispatch = useDispatch();
  const { setEmail } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    },
    mode: 'all',
  });

  const onSubmit = async (values: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    setLoading(true);
    try {
      onSuccess();
      dispatch(
        temporaryRegisterReq({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          phone: values.phone,
          address: address,
          coordinates: {
            lat: coordinates[0],
            lng: coordinates[1],
          },
        })
      );
      setLoading(false);
      setEmail(values.email);
      navigate('/verify-email');
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErr(error as string);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center gap-10">
          <div className="bg-[#fff] border shadow-lg p-5 rounded-lg ">
            <div className="items-center flex justify-center mb-5 text-xl font-bold relative ">
              <h1>Personal Data</h1>
            </div>
            <div className="flex justify-center mb-5">
              <div>
                <label className={labelClasses}>
                  <User size={18} /> Full Name
                </label>
                <input
                  {...register('fullName', {
                    required: 'Full Name is required',
                  })}
                  className={inputClasses}
                  placeholder="John Doe"
                  spellCheck="false"
                />
              </div>
            </div>
            <div className="flex justify-center mb-5">
              <div>
                <label className={labelClasses}>
                  <Mail size={18} /> E-mail
                </label>
                <input
                  {...register('email', { required: 'E-mail is required' })}
                  className={inputClasses}
                  placeholder="test@gmail.com"
                  spellCheck="false"
                />
              </div>
            </div>
            <div className="flex justify-center mb-5">
              <div className="">
                <label className={labelClasses} htmlFor="password">
                  <RectangleEllipsis size={23} />
                  <h1 className="mt-[2px] ml-1">Password</h1>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    spellCheck="false"
                    placeholder="12345678Test"
                    id="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    className={inputClasses}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 delay-50 duration-300 "
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div>
                <label className={labelClasses}>
                  <Phone size={18} /> Phone
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  className={inputClasses}
                  placeholder="+1 234 567 890"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
          <div className="bg-[#fff] border shadow-lg p-5 rounded-lg ">
            <div className="flex justify-center mb-5 text-xl font-bold relative">
              <h1>Address</h1>
            </div>

            <div className="flex flex-col items-center my-5">
              <AddressPicker
                address={address}
                setAddress={setAddress}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <motion.button
            type="submit"
            disabled={!isValid || loading}
            whileTap={{ scale: 0.99 }}
            className={`w-150  p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] delay-50 transition-all duration-300 ease-in-out`}
          >
            <span className="text-[#fff] font-bold duration-300 transition-colors ease-in-out ">
              {loading ? 'Creating account...' : 'Create account'}
            </span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};
