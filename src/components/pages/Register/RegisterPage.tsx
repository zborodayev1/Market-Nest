import { Avatar } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'
import { selectIsAuth } from '../../../components/redux/slices/auth'
import { Navigate } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RegisterForm } from './RegisterForm'

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
  const isAuth = useSelector(selectIsAuth)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <div className="bg-[#fafafa] h-screen flex flex-wrap justify-center">
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
            <RegisterForm
              setLoading={setLoading}
              setErr={setErr}
              loading={loading}
            />
          </div>
          {err && !loading && (
            <h1 className="text-[#D3312F] font-bold mt-2 text-md ml-3 flex justify-center mr-2">
              {err}
            </h1>
          )}
        </animated.div>
      </div>
      {loading && (
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
