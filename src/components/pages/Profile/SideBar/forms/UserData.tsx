import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  RootState,
  selectUserProfile,
  updateProfileData,
} from '../../../../redux/slices/auth'
import { User, Phone, MapPin, Building2, Globe } from 'lucide-react'

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
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      fullName: userData?.fullName || '',
      phone: userData?.phone || '',
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

  const [isHovered, setIsHovered] = useState(false)

  const inputClasses =
    'w-full px-4 py-2 bg-[#16151A] dark:bg-gray-800 border border-[#7e2dff] dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e2dff] dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200 '
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-white dark:text-gray-300 mb-1'

  return (
    <AnimatePresence>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md mx-auto p-6 bg-[#16151A] border-[2px] border-[#7e2dff]  dark:bg-gray-900 rounded-xl shadow-lg space-y-6"
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
              <Phone size={18} /> Phone
            </label>
            <input
              {...register('phone')}
              className={inputClasses}
              spellCheck="false"
              placeholder="+1 234 567 890"
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
          initial={{ borderRadius: 5 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.02, borderRadius: 7 }}
          whileTap={{ scale: 0.99 }}
          className={` w-[300px] p-2 flex justify-center items-center text-[#7e2dff] border border-[#7e2dff] hover:-translate-y-1 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#7e2dff] hover:to-[#2124a8] hover:border-transparent group `}
        >
          <motion.span
            initial={{ textShadow: 'none' }}
            animate={{
              textShadow: isHovered
                ? '2px 2px 6px #fff, -2px -2px 6px #fff'
                : '',
              transition: { duration: 0.4 },
            }}
            exit={{ textShadow: 'none' }}
            className="  text-[#7e2dff]  duration-300 transition-colors ease-in-out group-hover:text-white  "
          >
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
