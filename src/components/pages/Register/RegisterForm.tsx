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
import Input from '../../ui/input/Input';

interface Props {
  setLoading: (loading: boolean) => void;
  setErr: (value: string) => void;
  loading: boolean;
  code: boolean;
  onSuccess: () => void;
}

export const RegisterForm = (props: Props) => {
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
    formState: { isValid, errors },
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

  const isEmailError = errors.email ? true : false;
  const isPasswordError = errors.password ? true : false;
  const isPhoneError = errors.phone ? true : false;
  const isFullNameError = errors.fullName ? true : false;

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
        <div className="flex justify-center  gap-5">
          <div className="bg-[#fff] border shadow-lg p-5 rounded-lg ">
            <div className="items-center flex justify-center mb-5 text-xl font-bold relative ">
              <h1>Personal Data</h1>
            </div>
            <div className="flex justify-center mb-5">
              <div>
                <label className={labelClasses}>
                  <User size={18} /> Full Name
                </label>
                <Input
                  type="text"
                  icon={<User size={18} />}
                  register={register}
                  isError={isFullNameError}
                  inputStyle="w-75 pl-5 py-2"
                  placeholder="Full Name"
                  sircleWidth={36}
                  sircleHeight={36}
                  sircleTop={2}
                  sircleRight={2}
                  sircleHeightActive={40}
                  sircleWidthActive={40}
                  iconRight={10}
                  iconTop={10}
                  isDef={true}
                  registerMaxLenghtValue={40}
                  registerMaxLenghtMessage="Full Name must be at max 40 characters"
                  registerName="fullName"
                  registerReq="Full Name is required"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1 ml-2">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center mb-5">
              <div>
                <label className={labelClasses}>
                  <Mail size={18} /> E-mail
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
            </div>
            <div className="flex justify-center mb-5">
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
                  registerMaxLenghtValue={40}
                  registerMaxLenghtMessage="Password must be at max 40 characters"
                  isMinLength={true}
                  registerMinLenghtValue={8}
                  registerMinLenghtMessage="Password must be at least 8 characters"
                  iconButtonOnCLick={() => setShowPassword(!showPassword)}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1 ml-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div>
                <label className={labelClasses}>
                  <Phone size={18} /> Phone
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
                  <p className="text-sm text-red-500 ml-2">
                    {errors.phone.message}
                  </p>
                )}
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
