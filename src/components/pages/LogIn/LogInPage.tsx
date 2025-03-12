import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchLogin, selectIsAuth } from '../../../components/redux/slices/auth'
import { Link, Navigate } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'

import { motion } from 'motion/react'
import { Eye, EyeOff, Mail, RectangleEllipsis } from 'lucide-react'
import { AppDispatch } from '../../redux/store'
import { Helmet } from 'react-helmet-async'

export const LogInPage: React.FC = (): JSX.Element => {
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isAuth = useSelector(selectIsAuth)
  const dispatch: AppDispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  })

  const [showPassword, setShowPassword] = useState(false)

  const inputClasses =
    'w-full px-5 py-2 w-[200px] h-[50px] bg-[#fff] border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] focus:border-transparent transition-all duration-200 '
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-[#212121]  mb-1'

  const onSubmit = async (values: {
    email: string
    password: string
  }): Promise<void> => {
    setLoading(true)

    try {
      const resultAction = await dispatch(fetchLogin(values))
      setLoading(false)

      if (fetchLogin.fulfilled.match(resultAction)) {
        const { token } = resultAction.payload
        if (token) {
          window.localStorage.setItem('token', token)
        }
      } else {
        setErr('Login failed!')
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
      setErr('Something went wrong!')
    }
  }

  if (isAuth) {
    return <Navigate to="/" />
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
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className=" ">
          <div className="bg-[#FFFFFF] h-screen flex flex-wrap justify-center ">
            <div className="shadow-lg border px-16 mt-5 pt-8 w-[400px] h-[400px] items-center rounded-lg bg-[#FFFFFF]">
              <div>
                <div>
                  <div className="flex justify-center">
                    <h1 className="text-xl font-bold text-[#212121] mb-5">
                      Sign In
                    </h1>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-center mb-5">
                      <div>
                        <label className={labelClasses}>
                          <Mail size={18} /> E-mail
                        </label>
                        <input
                          {...register('email')}
                          className={inputClasses}
                          placeholder="test@gmail.com"
                          spellCheck="false"
                        />
                      </div>
                    </div>
                    <div className="flex justify-center mb-5">
                      <div>
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
                                message:
                                  'Password must be at least 8 characters',
                              },
                            })}
                            className={inputClasses}
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 "
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
                      <motion.button
                        type="submit"
                        disabled={!isValid || loading}
                        whileTap={{ scale: 0.99 }}
                        className={` w-[220px] p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] hover:-translate-y-1 transition-all duration-300 ease-in-out    `}
                      >
                        <span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out group-hover:text-white  ">
                          {loading ? 'Signing in...' : 'Sign in'}
                        </span>
                      </motion.button>
                    </div>
                  </form>
                  {err && !loading && (
                    <h1 className="text-[#D3312F] font-bold mt-2 text-md ml-3 flex justify-center mr-2">
                      {err}
                    </h1>
                  )}
                </div>
                <div className="flex justify-center mt-2">
                  <h1 className="">Don't have an account?</h1>
                  <Link to="/register">
                    <div className="w-full">
                      <h1 className="ml-2 text-blue-500 hover:underline rounded-lg duration-300">
                        Register
                      </h1>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {loading && (
            <LinearProgress
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
              }}
            />
          )}
        </div>
      </motion.div>
    </>
  )
}
