import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectUserProfile,
  updateProfileData,
} from '../../../redux/slices/auth'
import { AppDispatch } from '../../../redux/store'
import { selectLanguage } from '../../../redux/slices/main'

interface Formdata {
  fullName: string
  phone: string
  address: string
  city: string
  country: string
}

interface Props {
  onSuccess: () => void
}

export const UpdateDataForm = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const userData = useSelector(selectUserProfile)
  const { onSuccess } = props
  const language = useSelector(selectLanguage)
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formdata>({
    mode: 'onSubmit',
    defaultValues: {
      fullName: userData?.fullName,
      phone: userData?.phone || '',
      address: userData?.address || '',
      city: userData?.city || '',
      country: userData?.country || '',
    },
  })
  const onSubmit = async (values: FormData) => {
    try {
      const action = await dispatch(updateProfileData(values))
      if (updateProfileData.fulfilled.match(action)) {
        reset(action.payload.user)
        onSuccess()
      } else {
        console.error('Err')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error('Err')
    }
  }
  const errorMessage =
    language === 'enUS'
      ? 'This field is required!'
      : language === 'kkKZ'
        ? 'Бұл өріс міндетті түрде қажет!'
        : 'Это поле обязательно!'

  const fullName =
    language === 'enUS'
      ? 'Full name'
      : language === 'kkKZ'
        ? 'Толық аты'
        : 'Полное имя'
  const phone = language === 'enUS' ? 'Phone' : 'Телефон'
  const address =
    language === 'enUS'
      ? 'Address'
      : language === 'kkKZ'
        ? 'Мекенжайы'
        : 'Адрес'
  const city =
    language === 'enUS' ? 'City' : language === 'kkKZ' ? 'Қала' : 'Город'
  const country =
    language === 'enUS' ? 'Country' : language === 'kkKZ' ? 'Қоштана' : 'Страна'

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center">
        <div className="flex flex-col my-2">
          <div className="">
            <TextField
              {...register('fullName', {
                required: errorMessage,
              })}
              error={Boolean(errors.fullName?.message)}
              helperText={errors.fullName?.message}
              label={fullName}
            />
          </div>
          <div className="mt-3">
            <TextField
              {...register('phone', {
                required: errorMessage,
              })}
              error={Boolean(errors.phone?.message)}
              helperText={errors.phone?.message}
              label={phone}
            />
          </div>
          <div className="mt-3">
            <TextField
              {...register('address', {
                required: errorMessage,
              })}
              error={Boolean(errors.address?.message)}
              helperText={errors.address?.message}
              label={address}
            />
          </div>
          <div className="mt-3">
            <TextField
              {...register('city')}
              error={Boolean(errors.city?.message)}
              helperText={errors.city?.message}
              label={city}
            />
          </div>
          <div className="mt-3">
            <TextField
              {...register('country')}
              error={Boolean(errors.country?.message)}
              helperText={errors.country?.message}
              label={country}
            />
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="w-[200px] h-[35px] bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 "
            >
              {language === 'enUS'
                ? 'Submit'
                : language === 'kkKZ'
                  ? 'Сақтау'
                  : 'Сохранить'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
