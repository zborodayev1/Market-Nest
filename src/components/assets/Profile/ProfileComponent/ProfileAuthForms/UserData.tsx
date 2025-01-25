import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  RootState,
  selectUserProfile,
  updateProfileData,
} from '../../../../redux/slices/auth'
import { User, MapPin, Building2, Globe } from 'lucide-react'
import { AppDispatch } from '../../../../redux/store'

interface FormData {
  fullName?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

interface Props {
  onSuccess: () => void
}

export const UserData = ({ onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const userData = useSelector(selectUserProfile)
  const status = useSelector((state: RootState) => state.auth.status)
  const error = useSelector((state: RootState) => state.auth.error)
  const dispatch: AppDispatch = useDispatch()

  const {
    register,
    handleSubmit,

    reset,
  } = useForm<FormData>({
    defaultValues: {
      fullName: userData?.fullName || '',
      address: userData?.address || '',
      city: userData?.city || '',
      country: userData?.country || '',
    },
  })

  const onSubmit = (values: FormData) => {
    try {
      setIsSubmitting(true)
      dispatch(updateProfileData(values))

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
        className="max-w-md mx-auto p-6 bg-[#fff] border-[2px] border-[#212121]  dark:bg-gray-900 rounded-xl shadow-lg space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
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

          <div>
            <label className={labelClasses}>
              <MapPin size={18} /> Address
            </label>
            <input
              {...register('address')}
              className={inputClasses}
              spellCheck="false"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className={labelClasses}>
              <Building2 size={18} /> City
            </label>
            <input
              {...register('city')}
              className={inputClasses}
              spellCheck="false"
              placeholder="New York"
            />
          </div>

          <div>
            <label className={labelClasses}>
              <Globe size={18} /> Country
            </label>
            <input
              {...register('country')}
              className={inputClasses}
              spellCheck="false"
              placeholder="United States"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.99 }}
          className={` w-full p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out    `}
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
