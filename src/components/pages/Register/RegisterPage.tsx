import { motion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { selectIsAuth } from '../../../redux/slices/authSlice';
import { RegisterForm } from './RegisterForm';

interface Props {
  code: boolean;
  onSuccess: () => void;
}

export const RegisterPage = (props: Props) => {
  const { code, onSuccess } = props;
  const isAuth = useSelector(selectIsAuth);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Sign up</title>
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
        transition={{
          opacity: { duration: 0.5, delay: 0.2 },
        }}
        className="h-[100vh]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#fff] flex  justify-center"
        >
          <div className="mt-5">
            <div className="flex justify-center">
              <h1 className="text-2xl  font-bold text-[#212121] mb-5">
                Register
              </h1>
            </div>
            <div>
              <RegisterForm
                setLoading={setLoading}
                setErr={setErr}
                loading={loading}
                code={code}
                onSuccess={onSuccess}
              />
            </div>
            {err && !loading && (
              <h1 className="text-[#D3312F] font-bold mt-2 text-md ml-3 flex justify-center mr-2">
                {err}
              </h1>
            )}
            <div className="flex justify-center mt-2">
              <h1>Already have an account?</h1>
              <Link to="/signIn">
                <div className="w-full">
                  <h1 className="ml-2 text-blue-500 hover:underline rounded-lg duration-300 delay-50">
                    Sign in
                  </h1>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
