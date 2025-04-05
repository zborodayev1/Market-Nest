import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { loginReq, selectIsAuth } from '../../../redux/slices/authSlice';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, RectangleEllipsis } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AppDispatch } from '../../../redux/store';
import Input from '../../ui/input/Input';

export const LogInPage: React.FC = (): JSX.Element => {
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAuth = useSelector(selectIsAuth);
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-black mb-1';
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      console.log('values', values);
      dispatch(loginReq(values));
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErr(error as string);
    } finally {
      setLoading(false);
    }
  };

  const isEmailError = errors.email ? true : false;
  const isPasswordError = errors.password ? true : false;

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Sign in</title>
        <meta
          name="description"
          content="Welcome to the sign in page of Market Nest"
        />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests, login, market nest login, market nest sign in"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center"
      >
        <div>
          <h1 className="flex justify-center my-5 font-bold text-2xl">
            Sign in
          </h1>
          <form
            className="rounded-lg border px-15 py-8"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                isPattern={true}
                registerPatternMessage="Invalid email address"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1 ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label className={labelClasses} htmlFor="password">
                <RectangleEllipsis size={23} />
                Password
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
                iconButtonOnCLick={() => setShowPassword(!showPassword)}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1 ml-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !isValid}
              className="mt-5 w-[340px] p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]   transition-all duration-300 ease-in-out delay-50"
            >
              <span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out   ">
                {loading ? 'Sign in...' : 'Sign in'}
              </span>
            </button>
            <div className="flex justify-center mt-2">
              <h1 className="">Don't have an account?</h1>
              <Link to="/register">
                <div className="w-full">
                  <h1 className="ml-2 text-blue-500 hover:underline rounded-lg duration-300 delay-50">
                    Register
                  </h1>
                </div>
              </Link>
            </div>
            {err && !loading && (
              <h1 className="text-[#D3312F] font-bold mt-2 text-md ml-3 flex justify-center mr-2">
                {err}
              </h1>
            )}
          </form>
        </div>
      </motion.div>
    </>
  );
};
