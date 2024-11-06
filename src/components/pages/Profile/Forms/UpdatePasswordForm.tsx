import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { updateProfilePassword } from '../../../redux/slices/auth'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'
import { FormHelperText, LinearProgress } from '@mui/material'
import { selectLanguage } from '../../../redux/slices/main'
interface FormData {
  password: string
  oldPassword: string
}

interface Props {
  onSuccess: () => void
}

export const UpdatePasswordForm = (props: Props) => {
  const { onSuccess } = props
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [authError, setAuthError] = useState<string>('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onSubmit' })
  const language = useSelector(selectLanguage)

  const onSubmit = async (values: FormData) => {
    try {
      setLoading(true)
      const action = await dispatch(updateProfilePassword(values))

      if (updateProfilePassword.fulfilled.match(action)) {
        onSuccess()
      } else {
        setAuthError('Error while updating profile')
        console.error('Err')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error('Err')
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }
  let buttonText
  if (loading && !authError) {
    buttonText =
      language === 'enUS'
        ? 'Submitting...'
        : language === 'ruRU'
          ? 'Сохранение...'
          : 'Жіберілуде...'
  } else {
    buttonText =
      language === 'enUS'
        ? 'Submit'
        : language === 'ruRU'
          ? 'Сохранить'
          : 'Жіберу'
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center">
        <div className="flex flex-col my-2">
          <div className="flex">
            <FormControl
              variant="outlined"
              error={Boolean(errors.oldPassword?.message)}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                {language === 'enUS'
                  ? 'Password'
                  : language === 'ruRU'
                    ? 'Пароль'
                    : 'Құпия сөз'}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? 'hide the password'
                          : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                {...register('oldPassword', {
                  required: 'This field is required!',
                })}
              />
              {errors.oldPassword && (
                <FormHelperText>{errors.oldPassword.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="mt-2 flex">
            <FormControl variant="outlined" error={Boolean(errors.password)}>
              <InputLabel htmlFor="outlined-adornment-password">
                {language === 'enUS'
                  ? 'New password'
                  : language === 'ruRU'
                    ? 'Новый пароль'
                    : 'Жаңа құпия сөз'}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? 'hide the password'
                          : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="New password"
                {...register('password', {
                  required: 'This field is required!',
                })}
              />
              {errors.password && (
                <FormHelperText>{errors.password.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="flex justify-center mt-2">
            <button
              type="submit"
              className="w-full h-[35px] bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 "
            >
              {buttonText}
            </button>
          </div>
        </div>
      </form>
      <div>
        {authError && (
          <div className="text-red-600 font-bold ml-2">
            {language === 'enUS'
              ? 'Error while updating profile'
              : language === 'ruRU'
                ? 'Ошибка при обновлении профиля'
                : 'Профильді жаңарту қатесі'}
          </div>
        )}
      </div>
      {loading && !authError && (
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
  )
}
