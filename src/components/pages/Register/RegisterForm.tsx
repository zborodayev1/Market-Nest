import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { fetchTemporaryRegister } from '../../redux/slices/auth'
import {
  Eye,
  EyeOff,
  Mail,
  RectangleEllipsis,
  User,
  Phone,
  MapPin,
  Building2,
  Globe,
  // Binary,
} from 'lucide-react'
import { motion } from 'motion/react'
import { AppDispatch } from '../../redux/store'
import { useNavigate } from 'react-router-dom'

interface Props {
  setLoading: (loading: boolean) => void
  setErr: (value: string) => void
  loading: boolean
  code: boolean
  onSuccess: () => void
}

export const RegisterForm = (props: Props) => {
  const inputClasses =
    ' px-5 py-2 w-[300px] h-[50px] bg-[#fff] dark:bg-gray-800 border border-[#212121] dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200 '
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-[#212121] dark:text-gray-300 mb-1'

  const { setLoading, setErr, loading, onSuccess } = props
  const dispatch: AppDispatch = useDispatch()

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      country: '',
    },
    mode: 'all',
  })

  const onSubmit = async (values: {
    fullName: string
    email: string
    password: string
    phone: string
    address: string
    city: string
    country: string
  }) => {
    setLoading(true)
    try {
      onSuccess()
      await dispatch(fetchTemporaryRegister(values)).unwrap()
      setLoading(false)
      navigate('/verify-email')
    } catch (error) {
      console.error(error)
      setLoading(false)
      setErr(error as string)
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="items-center flex justify-between mb-5 text-xl font-bold relative right-5">
          <h1>Personal Data</h1>
        </div>
        <div className="flex justify-center mb-5">
          <div>
            <label className={labelClasses}>
              <User size={18} /> Full Name
            </label>
            <input
              {...register('fullName', { required: 'Full Name is required' })}
              className={inputClasses}
              placeholder="John Doe"
              spellCheck="false"
            />
          </div>
        </div>
        <div className="flex justify-center mb-5">
          <div>
            <label className={labelClasses}>
              <Mail size={18} /> E-mail
            </label>
            <input
              {...register('email', { required: 'E-mail is required' })}
              className={inputClasses}
              placeholder="test@gmail.com"
              spellCheck="false"
            />
          </div>
        </div>
        <div className="flex justify-center mb-5">
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
        <div className="flex justify-center">
          <div>
            <label className={labelClasses}>
              <Phone size={18} /> Phone
            </label>
            <input
              {...register('phone', { required: 'Phone is required' })}
              className={inputClasses}
              placeholder="+1 234 567 890"
              spellCheck="false"
            />
          </div>
        </div>
        <div className="items-center my-5 text-xl font-bold relative right-5">
          <h1>Address</h1>
        </div>
        <div className="flex justify-center mb-5">
          <div>
            <label className={labelClasses}>
              <MapPin size={18} /> Address
            </label>
            <input
              {...register('address', { required: 'Address is required' })}
              className={inputClasses}
              placeholder="123 Main St"
              spellCheck="false"
            />
          </div>
        </div>
        <div className="flex justify-center mb-5">
          <div>
            <label className={labelClasses}>
              <Building2 size={18} /> City
            </label>
            <input
              {...register('city', {
                required: 'City is required',
              })}
              className={inputClasses}
              placeholder="New York"
              spellCheck="false"
            />
          </div>
        </div>
        <div className="flex justify-center mb-5">
          <div>
            <label className={labelClasses}>
              <Globe size={18} /> Country
            </label>
            <input
              {...register('country', { required: 'Country is required' })}
              className={inputClasses}
              placeholder="United States"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button
            type="submit"
            disabled={!isValid || loading}
            whileTap={{ scale: 0.99 }}
            className={`w-full p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] hover:-translate-y-1 transition-all duration-300 ease-in-out`}
          >
            <span className="text-[#fff] font-bold duration-300 transition-colors ease-in-out group-hover:text-white">
              {loading ? 'Creating account...' : 'Create account'}
            </span>
          </motion.button>
        </div>
      </form>
    </div>
  )
}
