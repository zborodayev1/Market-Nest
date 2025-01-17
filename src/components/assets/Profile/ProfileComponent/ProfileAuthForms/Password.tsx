import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  selectUserProfile,
  updateProfilePassword,
} from '../../../../redux/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, RectangleEllipsis } from 'lucide-react'
import { useState } from 'react'
import { AppDispatch } from '../../../../redux/store'
import { toast } from 'react-toastify'

interface Formdata {
  password?: string
  newPassword?: string
}
interface Props {
  onSuccess: () => void
}
export const Password = (props: Props) => {
  const userData = useSelector(selectUserProfile)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [forgotPassPage, setforgotPassPage] = useState(false)
  const { onSuccess } = props
  const dispatch: AppDispatch = useDispatch()
  const { reset, register, handleSubmit } = useForm<Formdata>({
    mode: 'onSubmit',
  })

  const onSubmit = async (values: Formdata) => {
    try {
      setIsSubmitting(true)

      const payload = {
        oldPassword: values.password || '',
        password: values.newPassword || '',
      }

      const resultAction = await dispatch(updateProfilePassword(payload))

      if (updateProfilePassword.fulfilled.match(resultAction)) {
        reset({ ...userData, ...values })
        onSuccess()
      } else {
        console.error('Ошибка:', resultAction.payload || 'Неизвестная ошибка')
        toast(resultAction.payload || 'Неизвестная ошибка', {
          type: 'error',
          position: 'bottom-right',
        })
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
        className="max-w-md mx-auto p-6 bg-[#fff] border-[2px] border-[#212121] dark:bg-gray-900 rounded-xl shadow-lg space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div className="">
            <label className={labelClasses} htmlFor="password">
              <RectangleEllipsis size={23} />
              <h1 className="mt-[2px] ml-1">Old Password</h1>
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

          <div className="">
            <label className={labelClasses} htmlFor="password">
              <RectangleEllipsis size={23} />
              <h1 className="mt-[2px] ml-1">New Password</h1>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                spellCheck="false"
                placeholder="12345678Abc"
                id="password"
                {...register('newPassword', {
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
          className={` w-[325px] p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] hover:-translate-y-1 transition-all duration-300 ease-in-out    `}
        >
          <motion.span className="  text-[#fff] font-bold  duration-300 transition-colors ease-in-out group-hover:text-white  ">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </motion.span>
        </motion.button>

        <button>Forgot password</button>
      </motion.form>
    </AnimatePresence>
  )
}
