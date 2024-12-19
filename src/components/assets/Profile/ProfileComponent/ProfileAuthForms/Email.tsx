import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  RootState,
  selectUserProfile,
  updateProfileEmail,
} from '../../../../redux/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Eye, EyeOff, RectangleEllipsis } from 'lucide-react'
import { useState } from 'react'
import { AppDispatch } from '../../../../redux/store'

interface Formdata {
  email?: string
  password?: string
}
interface Props {
  onSuccess: () => void
}
export const Email = (props: Props) => {
  const userData = useSelector(selectUserProfile)
  const status = useSelector((state: RootState) => state.auth.status)
  const error = useSelector((state: RootState) => state.auth.error)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({ email: '' })
  const { onSuccess } = props
  const dispatch: AppDispatch = useDispatch()
  const { reset, register, handleSubmit } = useForm<Formdata>({
    mode: 'onSubmit',
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const onSubmit = async (values: Formdata) => {
    try {
      setIsSubmitting(true)
      // Validate before dispatching
      const emailError = !validateEmail(values.email || '')
        ? 'Invalid email format'
        : ''

      if (emailError) {
        setErrors({ email: emailError })
        return
      }

      dispatch(
        updateProfileEmail({
          email: values.email ?? '',
          password: values.password ?? '',
        })
      )

      if (status === 'succeeded') {
        reset({ ...userData, ...values })
        onSuccess()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  const inputClasses =
    'w-full px-4 py-2 bg-[#fff] border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] focus:border-transparent transition-all duration-200 '
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-black dark:text-gray-300 mb-1'

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
            <input
              {...register('email')}
              className={inputClasses}
              placeholder="test@gmail.com"
              spellCheck="false"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

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
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.99 }}
          className={` w-[340px] p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] hover:-translate-y-1 transition-all duration-300 ease-in-out    `}
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
  )
}
