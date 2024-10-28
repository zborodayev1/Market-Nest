/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, TextField, Button } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  updateProfile,
  selectIsAuth,
  selectUserProfile,
  fetchProfileData,
  deleteProfile,
} from '../../components/redux/slices/auth'
import { Navigate } from 'react-router-dom'
import { AppDispatch } from '../../components/redux/store'

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [clickedDelete, setClickedDelete] = useState(false)
  const [buttonText, setButtonText] = useState('Change')
  const [err, setErr] = useState<string | null>(null)
  const [redirect, setRedirect] = useState(false)
  const isAuth = useSelector(selectIsAuth)
  const userData = useSelector(selectUserProfile)
  const [handleDeleteConfirm, setHandleDeleteConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    mode: 'onSubmit',
  })

  const mainAnimation = useSpring({
    from: { width: '0px', height: '0px' },
    to: { width: '600px', height: '900px' },
  })

  const titleAnimation = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 700,
  })

  const inputAnimation = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 1500,
  })

  const inputAnimation2 = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 1600,
  })
  const inputAnimation3 = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 1700,
  })
  const inputAnimation4 = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 1800,
  })
  const inputAnimation5 = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 1900,
  })
  const inputAnimation6 = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 2000,
  })
  const inputAnimation7 = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 2100,
  })
  const inputAnimation8 = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 2200,
  })

  const textAnimation = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 500,
  })

  const imageAnimation = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 700,
  })

  const buttonAnimation = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 800,
  })

  const deleteButtonAnimation = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 1000,
  })

  const handleClick = () => {
    setClicked((prev) => !prev)
    setButtonText((prev) => (prev === 'Change' ? 'Cancel' : 'Change'))
  }

  const handleDelete = async () => {
    if (handleDeleteConfirm === true) {
      await dispatch(deleteProfile())
      setRedirect(true)
    }
    setClickedDelete((prev) => !prev)
  }
  const handleConfirmDelete = () => {
    setHandleDeleteConfirm(true)
    setLoading(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuth) {
        setRedirect(true)
      } else {
        const action = await dispatch(fetchProfileData())
        if (fetchProfileData.fulfilled.match(action)) {
          reset(action.payload)
        }
      }
    }
    fetchData()
  }, [isAuth, dispatch, reset])

  const onSubmit = async (values: any) => {
    if (!isValid) {
      setErr('Something went wrong!')
      return
    }

    try {
      const resultAction = await dispatch(updateProfile(values))
      if (updateProfile.fulfilled.match(resultAction)) {
        setErr(null)
        setRedirect(true)
      } else {
        const errorMessage =
          (resultAction.payload as { message?: string })?.message ||
          'Something went wrong!'
        setErr(errorMessage)
      }
    } catch (error) {
      console.error(error)
      setErr('Something went wrong!')
    }
  }

  if (redirect) {
    return <Navigate to="/" />
  }

  return (
    <div className="bg-[#fafafa] h-[1100px] flex flex-wrap justify-center">
      <animated.div
        style={mainAnimation}
        className="bg-[#ffff] shadow-xl px-16 mt-5 pt-8 rounded-md"
      >
        <animated.div
          style={{
            height: clicked ? '900px' : '600px',
            overflow: 'hidden',
            transition: 'height 0.5s ease',
          }}
        >
          <div className="flex justify-center">
            <animated.h1
              style={{ ...textAnimation }}
              className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
            >
              Profile
            </animated.h1>
          </div>
          <animated.div
            style={{ ...imageAnimation }}
            className="flex justify-center mt-3"
          >
            <Avatar sx={{ width: 70, height: 70 }} src={userData?.avatarUrl} />
          </animated.div>

          <animated.div style={titleAnimation}>
            {!clicked && userData && (
              <div className="ml-[100px] my-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] text-transparent bg-clip-text">
                  Name: {userData.fullName}
                </h1>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] text-transparent bg-clip-text">
                  Email: {userData.email}
                </h1>
                {!userData.phone && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] text-transparent bg-clip-text">
                    phone number not specified
                  </h1>
                )}
                {userData.phone && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] text-transparent bg-clip-text">
                    Phone: {userData.phone}
                  </h1>
                )}
                {!userData.address && !userData.city && !userData.country && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] text-transparent bg-clip-text">
                    address not specified
                  </h1>
                )}
                {userData.address && userData.city && userData.country && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] text-transparent bg-clip-text">
                    Address: {userData.address}, {userData.city},{' '}
                    {userData.country}
                  </h1>
                )}
              </div>
            )}
          </animated.div>

          <div>
            {clicked && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <animated.div style={{ ...inputAnimation }}>
                  <TextField
                    {...register('fullName')}
                    label={'Full Name'}
                    fullWidth
                    margin="normal"
                    type={'text'}
                  />
                </animated.div>
                <animated.div style={{ ...inputAnimation2 }}>
                  <TextField
                    {...register('email')}
                    label={'Email'}
                    fullWidth
                    margin="normal"
                    type={'email'}
                  />
                </animated.div>
                <animated.div style={{ ...inputAnimation3 }}>
                  <TextField
                    {...register('password')}
                    label={'Password'}
                    fullWidth
                    margin="normal"
                    type={'password'}
                  />
                </animated.div>
                <animated.div style={{ ...inputAnimation4 }}>
                  <TextField
                    {...register('avatar')}
                    fullWidth
                    margin="normal"
                    type={'file'}
                  />
                </animated.div>
                <animated.div style={{ ...inputAnimation5 }}>
                  <TextField
                    {...register('phone')}
                    label={'Phone'}
                    fullWidth
                    margin="normal"
                    type={'text'}
                  />
                </animated.div>
                <animated.div style={{ ...inputAnimation6 }}>
                  <TextField
                    {...register('address')}
                    label={'Address'}
                    fullWidth
                    margin="normal"
                    type={'text'}
                  />
                </animated.div>
                <animated.div style={{ ...inputAnimation7 }}>
                  <TextField
                    {...register('city')}
                    label={'City'}
                    fullWidth
                    margin="normal"
                    type={'text'}
                  />
                </animated.div>
                <animated.div style={{ ...inputAnimation8 }}>
                  <TextField
                    {...register('country')}
                    label={'Country'}
                    fullWidth
                    margin="normal"
                    type={'text'}
                  />
                </animated.div>

                <Button
                  type="submit"
                  variant="contained"
                  className="w-full mt-3 bg-gradient-to-r from-[#173f35] to-[#14594c]"
                >
                  Submit
                </Button>
              </form>
            )}
          </div>

          <animated.div
            style={{ ...buttonAnimation }}
            className="flex justify-center mt-3"
          >
            <Button
              onClick={handleClick}
              variant="contained"
              className="w-[200px] bg-gradient-to-r from-[#173f35] to-[#14594c]"
            >
              {buttonText}
            </Button>
          </animated.div>
          {!clicked && (
            <animated.button
              style={{ ...deleteButtonAnimation }}
              className="ml-[135px] mt-3 bg-red-600 text-white w-[200px] h-[35px] rounded-md"
              onClick={handleDelete}
            >
              {loading ? 'Deleting profile...' : 'Delete profile'}
            </animated.button>
          )}
          {clickedDelete && !clicked && (
            <div className="flex justify-center">
              <div>
                <div>
                  <h1 className="text-lg mt-2 ml-2 font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] text-transparent bg-clip-text">
                    Are you sure ?
                  </h1>
                </div>
                <button
                  onClick={handleConfirmDelete}
                  className=" w-[130px] bg-red-600 text-white rounded-md p-2 flex justify-center mt-2"
                >
                  Yes
                </button>
                <button
                  onClick={() => setClickedDelete(false)}
                  className="w-[130px] bg-gradient-to-r from-[#173f35] to-[#14594c] rounded-md text-white p-2 mt-2"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {err && (
            <h1 className="text-red-600 flex justify-center mt-2">{err}</h1>
          )}
        </animated.div>
      </animated.div>
    </div>
  )
}
