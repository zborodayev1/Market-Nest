import { VisibilityOff, Visibility } from '@mui/icons-material'
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material'
import { animated, useSpring } from '@react-spring/web'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { fetchRegister } from '../../redux/slices/auth'

interface Props {
  setLoading: (loading: boolean) => void
  setErr: (values: string) => void
  loading: boolean
}

export const RegisterForm = (props: Props) => {
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
    formState: { isValid, errors },
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
        setErr('Register failed!')
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
      setErr('Something went wrong!')
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

  return (
    <div>
      {' '}
      <form onSubmit={handleSubmit(onSubmit)}>
        <animated.div
          style={{ ...textField1 }}
          className="flex justify-center mb-5"
        >
          <TextField
            label="FullName"
            variant="outlined"
            {...register('fullName', {
              required: 'This field is required!',
            })}
            helperText={errors.fullName?.message}
            error={Boolean(errors.fullName?.message)}
          />
        </animated.div>
        <animated.div
          style={{ ...textField2 }}
          className="flex justify-center mb-5"
        >
          <TextField
            label="E-mail"
            {...register('email', {
              required: 'This field is required!',
            })}
            helperText={errors.email?.message}
            error={Boolean(errors.email?.message)}
          />
        </animated.div>
        <animated.div
          style={{ ...textField3 }}
          className="flex justify-center mb-5"
        >
          <FormControl
            className="w-[195px]"
            variant="outlined"
            error={Boolean(errors.password)}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
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
              {...register('password', {
                required: 'This field is required!',
              })}
            />
            {errors.password && (
              <FormHelperText>{errors.password.message}</FormHelperText>
            )}
          </FormControl>
        </animated.div>
        <animated.div style={{ ...button }} className="flex justify-center">
          <button
            disabled={!isValid || loading}
            type="submit"
            className="w-[200px] h-10 bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] transition-all ease-in-out duration-300 "
          >
            {loading ? 'Creating account...' : 'Create Account'}{' '}
          </button>
        </animated.div>
      </form>
    </div>
  )
}
