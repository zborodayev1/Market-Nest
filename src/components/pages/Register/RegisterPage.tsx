import { Avatar } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'
import { selectIsAuth } from '../../../components/redux/slices/auth'
import { Link, Navigate } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RegisterForm } from './RegisterForm'

export const RegisterPage = () => {
  const html = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  })
  const main = useSpring({
    from: { y: 100, width: '0px', height: '0px' },
    to: { y: 0, width: '400px', height: '500px' },
    delay: 10,
  })

  const isAuth = useSelector(selectIsAuth)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <div className="bg-[#fff] h-screen flex flex-wrap justify-center">
        <animated.div
          style={{ ...main }}
          className="bg-[#fff] border shadow-lg px-16 my-5 pt-8 w-[400px] h-[500px] phone:max-w-90 phone-md:max-w-96 rounded-md"
        >
          <div>
            <animated.div style={{ ...html }} className="flex justify-center">
              <h1 className="text-xl font-bold text-[#212121] mb-5">
                Register
              </h1>
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
          <div className="flex justify-center mt-2">
            <h1>Already have an account?</h1>
            <Link to="/signIn">
              <div className="w-full">
                <h1 className="ml-2 text-blue-500 hover:underline rounded-lg duration-300">
                  Sign in
                </h1>
              </div>
            </Link>
          </div>
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
