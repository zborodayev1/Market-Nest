import { motion } from 'framer-motion';
import { Binary } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth/useAuth';
import {
  fetchCompleteRegistration,
  selectIsAuth,
  UserEmail,
} from '../../../redux/slices/authSlice';
import { AppDispatch } from '../../../redux/store';

interface Props {
  code: boolean;
  onSuccess: () => void;
}

export const VerifyMail = (props: Props) => {
  const inputClasses =
    ' px-5 py-2 w-[300px] h-[50px] bg-[#fff]  border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4]  focus:border-transparent transition-all duration-200 ';
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-[#212121]  mb-1';
  const { onSuccess } = props;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(
    (state: { auth: { user: UserEmail } }) => state.auth.user
  );
  const isAuth = useSelector(selectIsAuth);
  const [err, setErr] = useState<string | null>(null);
  const { email } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      email: '',
      code: '',
    },
    mode: 'all',
  });

  const onSubmit = async (values: { email: string; code: string }) => {
    setLoading(true);
    try {
      const data = await dispatch(
        fetchCompleteRegistration({ code: values.code, email: email })
      ).unwrap();
      setLoading(false);
      onSuccess();
      navigate('/');
      const token = data.token;
      if (token) {
        window.localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErr(error as string);
    }
  };

  useEffect(() => {
    if (isAuth) {
      setErr('You are already logged in');
    }
  }, [isAuth]);
  return (
    <>
      <Helmet>
        <title>Verify Email</title>
        <meta
          name="description"
          content="Welcome to the sign up page of Market Nest"
        />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests, login, market nest login, market nest sign up"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mt-5"
      >
        <div
          style={{
            boxShadow: `
            0px 10px 15px -3px rgba(0, 0, 0, 0.1), 
            0px 4px 6px -2px rgba(0, 0, 0, 0.05), 
            0px -5px 10px -3px rgba(0, 0, 0, 0.05)
          `,
          }}
          className="w-[540px] h-[400px] p-5 shadow-xl"
        >
          <div className="flex justify-center">
            <h1 className="font-bold text-2xl">Verify Your Email</h1>
          </div>
          <div className="text-sm flex justify-center mt-3">
            <p>
              Your verification code has been sent to your email -{' '}
              <p>{user?.email}</p>
            </p>
          </div>

          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center mb-5">
              <div>
                <label className={labelClasses}>
                  <Binary size={18} /> Code
                </label>
                <input
                  {...register('code', { required: 'Code is required' })}
                  className={inputClasses}
                  placeholder="123456"
                  spellCheck="false"
                  maxLength={6}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={!isValid || loading}
                whileTap={{ scale: 0.99 }}
                className={`w-[320px] p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out`}
              >
                <span className="text-[#fff] font-bold duration-300 transition-colors ease-in-out group-hover:text-white">
                  {loading ? 'Verifying...' : 'Verify'}
                </span>
              </motion.button>
            </div>
          </form>
          <h1 className="flex justify-center mt-3 text-red-500 font-bold">
            {err && <span>{err}</span>}
          </h1>
        </div>
      </motion.div>
    </>
  );
};
