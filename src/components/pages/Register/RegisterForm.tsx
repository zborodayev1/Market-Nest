import { animated, useSpring } from '@react-spring/web'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { fetchRegister } from '../../redux/slices/auth'
import { Eye, EyeOff, Mail, RectangleEllipsis, User } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
  setLoading: (loading: boolean) => void
  setErr: (value: string) => void
  loading: boolean
}

export const RegisterForm = (props: Props) => {
  const inputClasses =
    'w-full px-5 py-2 w-[200px] h-[50px] bg-[#fff] dark:bg-gray-800 border border-[#212121] dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200 '
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-[#212121] dark:text-gray-300 mb-1'
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
  const textField3 = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 100,
  })
  const button = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 100,
  })

  const { setLoading, setErr, loading } = props
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'all',
  })

  const onSubmit = async (values: {
    fullName: string
    email: string
    password: string
  }) => {
    setLoading(true)
    try {
      const data = await dispatch(fetchRegister(values))
      setLoading(false)

      if (fetchRegister.fulfilled.match(data)) {
        const { token } = data.payload
        if (token) {
          window.localStorage.setItem('token', token)
        }
      } else {
        setErr('Registration failed!')
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
      setErr('Something went wrong!')
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <animated.div
          style={{ ...textField1 }}
          className="flex justify-center mb-5"
        >
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
        </animated.div>
        <animated.div
          style={{ ...textField2 }}
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
          style={{ ...textField3 }}
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

        <animated.div style={{ ...button }} className="flex justify-center">
          <motion.button
            type="submit"
            disabled={!isValid || loading}
            whileTap={{ scale: 0.99 }}
            className={`w-[220px] p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] hover:-translate-y-1 transition-all duration-300 ease-in-out`}
          >
            <span className="text-[#fff] font-bold duration-300 transition-colors ease-in-out group-hover:text-white">
              {loading ? 'Creating account...' : 'Create account'}
            </span>
          </motion.button>
        </animated.div>
      </form>
    </div>
  )
}
