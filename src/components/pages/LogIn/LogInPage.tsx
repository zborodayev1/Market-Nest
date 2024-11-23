import { animated, useSpring } from '@react-spring/web'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchLogin, selectIsAuth } from '../../../components/redux/slices/auth'
import { Link, Navigate } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'

import { motion } from 'motion/react'
import { Eye, EyeOff, Mail, RectangleEllipsis } from 'lucide-react'

export const LogInPage: React.FC = (): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  const text = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  })
  const main = useSpring({
    from: { y: 100, width: '0px', height: '0px', spin: 0 },
    to: { y: 0, width: '400px', height: '400px', spin: isHovered2 ? 180 : 0 },
    delay: 10,
  })
  const textField1 = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 100,
  })
  const textField2 = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 100,
  })
  const button = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 100,
  })

  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
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
    'w-full px-5 py-2 w-[200px] h-[50px] bg-[#16151A] dark:bg-gray-800 border border-[#7e2dff] dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e2dff] dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200 '
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-white dark:text-gray-300 mb-1'

  const onSubmit = async (values: {
    email: string
    password: string
  }): Promise<void> => {
    setLoading(true)
    setIsHovered2(true)
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
    <div>
      <div className=" ">
        <div className="bg-[#16151A] h-screen flex flex-wrap justify-center ">
          <animated.div
            style={{ ...main }}
            className="border-x-[#7e2dff] border-y-[#0004ff] border-2 shadow-lg px-16 mt-5 pt-8 w-[400px] h-[400px] items-center  rounded-lg bg-[#16151A]"
          >
            <div>
              <div>
                <animated.div
                  style={{ ...text }}
                  className="flex justify-center"
                >
                  <h1 className="text-xl font-bold  bg-gradient-to-r from-[#7e2dff] to-[#0004ff] bg-clip-text text-transparent duration-300 transition-colors ease-in-out mb-10">
                    Sign In
                  </h1>
                </animated.div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <animated.div
                    style={{ ...textField1 }}
                    className="flex justify-center mb-5"
                  >
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
                  </animated.div>
                  <animated.div
                    style={{ ...textField2 }}
                    className="flex justify-center mb-5"
                  >
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </animated.div>
                  <animated.div
                    style={{ ...button }}
                    className="flex justify-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <motion.button
                      type="submit"
                      disabled={!isValid || loading}
                      initial={{ borderRadius: 10 }}
                      whileHover={{ scale: 1.02, borderRadius: 12 }}
                      whileTap={{ scale: 0.99 }}
                      className={` w-[215px] p-2 flex rounded-md justify-center items-center  border border-[#7e2dff] hover:-translate-y-1 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#7e2dff] hover:to-[#2124a8] hover:border-transparent group `}
                    >
                      <span
                        style={{
                          textShadow: isHovered
                            ? '2px 2px 6px #fff, -2px -2px 6px #fff'
                            : 'none',
                        }}
                        className="  text-[#7e2dff]  duration-300 transition-colors ease-in-out group-hover:text-white  "
                      >
                        {loading ? 'Signing in...' : 'Sign in'}
                      </span>
                    </motion.button>
                  </animated.div>
                </form>
                {err && !loading && (
                  <h1 className="text-[#D3312F] font-bold mt-2 text-md ml-3 flex justify-center mr-2">
                    {err}
                  </h1>
                )}
              </div>
              <div className="flex justify-center mt-2">
                <h1 className="">No accaunt?</h1>
                <Link to="/register">
                  <div className="w-full">
                    <h1 className="ml-2 text-blue-500 hover:underline rounded-lg duration-300">
                      Register
                    </h1>
                  </div>
                </Link>
              </div>
            </div>
          </animated.div>
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
    </div>
  )
}
