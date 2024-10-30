import { Avatar } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useSpring, animated } from '@react-spring/web'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchRegister, selectIsAuth } from '../../components/redux/slices/auth'
import { Navigate } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'

export const RegisterPage = () => {
  const text = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  })
  const div = useSpring({
    from: { y: 100, width: '0px', height: '0px' },
    to: { y: 0, width: '400px', height: '500px' },
    delay: 10,
  })
  const img = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 50,
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

  const [err, setErr] = useState<string | null>(null)
  const isAuth = useSelector(selectIsAuth)
  const [loading, setLoading] = useState(false)
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

  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <div className="bg-[#fafafa] h-[687px] flex flex-wrap justify-center">
        <animated.div
          style={{ ...div }}
          className="bg-[#ffff] shadow-lg px-16 mt-5 pt-8 w-[400px] h-[500px] phone:max-w-90 phone-md:max-w-96 rounded-md"
        >
          <div>
            <animated.div style={{ ...text }} className="flex justify-center">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c]">
                Register
              </h1>
            </animated.div>
            <animated.div
              style={{ ...img }}
              className="flex justify-center mt-3 mb-3"
            >
              <Avatar sx={{ width: 70, height: 70 }} src="/broken-image.jpg" />
            </animated.div>
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
                <TextField
                  label="Password"
                  {...register('password', {
                    required: 'This field is required!',
                  })}
                  error={Boolean(errors.password?.message)}
                  helperText={errors.password?.message}
                />
              </animated.div>
              <animated.div
                style={{ ...button }}
                className="flex justify-center"
              >
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
          {err && !loading && (
            <h1 className="text-[#D3312F] font-bold mt-2 text-md ml-3 flex justify-center mr-2">
              {err}
            </h1>
          )}
        </animated.div>
      </div>
      {loading && <LinearProgress />}
    </div>
  )
}
