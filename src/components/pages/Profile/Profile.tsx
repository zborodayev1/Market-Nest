import { Avatar, TextField } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  selectIsAuth,
  selectUserProfile,
  fetchProfileData,
  updateProfileData,
  updateProfileEmail,
} from '../../redux/slices/auth'
import { Navigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../../redux/store'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CircularProgress from '@mui/material/CircularProgress'
import { ProfileButton } from './ProfileButton'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { UpdatePasswordForm } from './UpdatePasswordForm'

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [redirect, setRedirect] = useState(false)
  const [loadingError, setLoadingError] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [dropdownType, setDropdownType] = useState('')
  const isAuth = useSelector(selectIsAuth)
  const userData = useSelector(selectUserProfile)
  const loading = useSelector((state: RootState) => state.auth.loading)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      fullName: userData?.fullName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
      city: userData?.city || '',
      country: userData?.country || '',
    },
  })

  const settings = useSpring({
    from: { opacity: 0, y: 100, width: 0, height: 0 },
    to: { opacity: 1, y: 0, width: 572, height: 46 },
    delay: 1100,
  })

  const mainAnimation = useSpring({
    from: { width: 0, height: 0 },
    to: { width: 600, height: 600 },
    delay: 80,
  })

  const titleAnimation = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 900,
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

  const button = useSpring({
    from: { opacity: 0, y: 100, width: 0, height: 0 },
    to: { opacity: 1, y: 0, width: 572, height: 46 },
    delay: 500,
  })

  const handleChangeProfileData = () => {
    setDropdown(true)
    setDropdownType('profile data')
    console.log(dropdownType)
  }

  const handleChangePassword = () => {
    setDropdown(true)
    setDropdownType('change password')
  }

  const handleChangeEmail = () => {
    setDropdown(true)
    setDropdownType('change email')
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuth) {
        setRedirect(true)
        return
      }
      if (userData && !loading && !loadingProfile) {
        const action = await dispatch(fetchProfileData())
        setLoadingProfile(true)
        if (fetchProfileData.fulfilled.match(action)) {
          reset(action.payload)
        }
      }
    }
    fetchData()

    const timer = setTimeout(() => {
      if (!userData && !loading) {
        setLoadingError(true)
      }
    }, 12000)

    return () => clearTimeout(timer)
  }, [isAuth, dispatch, reset, loading, userData, loadingProfile])

  const onSubmit = async (
    values: {
      fullName?: string
      email: string
      phone?: string
      address?: string
      city?: string
      country?: string
      password?: string
      oldPassword?: string
    },
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    switch (dropdownType) {
      case 'profile data':
        try {
          const action = await dispatch(updateProfileData(values))
          if (updateProfileData.fulfilled.match(action)) {
            reset(action.payload.user)
            setDropdown(false)
          } else {
            console.error('Err')
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          console.error('Err')
        }
        break
      case 'change email':
        try {
          const action = await dispatch(updateProfileEmail(values))
          if (updateProfileEmail.fulfilled.match(action)) {
            reset(action.payload.user)
            setDropdown(false)
          } else {
            console.error('Err')
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          console.error('Err')
        }
        break
    }
  }
  if (redirect) {
    return <Navigate to="/" />
  }
  return (
    <div className="bg-[#fafafa] h-screen flex flex-wrap justify-center">
      <animated.div
        style={mainAnimation}
        className="bg-[#ffff] shadow-xl px-5 mt-5 pt-8 rounded-md"
      >
        <animated.div>
          <div className="flex justify-center">
            <animated.h1
              style={{ ...textAnimation }}
              className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
            >
              {dropdown ? 'Edit Profile' : 'Profile'}
            </animated.h1>
          </div>
          <animated.div
            style={{ ...imageAnimation }}
            className="flex justify-center mt-3"
          >
            <Avatar sx={{ width: 70, height: 70 }} src={userData?.avatarUrl} />
          </animated.div>

          <animated.div style={titleAnimation}>
            {loadingError && (
              <div className="flex justify-center mt-2">
                <h1 className="text-red-500 font-bold">
                  Error: data not be loaded.
                </h1>
              </div>
            )}
            {!userData && !loadingError && (
              <div className="flex justify-center mt-2">
                <h1>Loading...</h1>
                <div className="ml-2 mt-1">
                  <CircularProgress color="inherit" size="20px" />
                </div>
              </div>
            )}
            {userData && !dropdown && (
              <div className="my-1">
                <h1 className="my-2">Personal data</h1>
                <ProfileButton
                  animationStyle={button}
                  title="Name"
                  value={userData.fullName}
                  onClick={handleChangeProfileData}
                />

                <ProfileButton
                  title="Email"
                  value={userData.email}
                  animationStyle={button}
                  onClick={handleChangeEmail}
                />

                <ProfileButton
                  title="Phone"
                  value={userData.phone || 'N/A'}
                  animationStyle={button}
                  onClick={handleChangeProfileData}
                />

                <ProfileButton
                  title="Address"
                  value={
                    userData.address && userData.city && userData.country
                      ? `${userData.address}, ${userData.city}, ${userData.country}`
                      : 'N/A'
                  }
                  animationStyle={button}
                  onClick={handleChangeProfileData}
                />
                <animated.button
                  style={{ ...button }}
                  className="flex justify-between h-[46px] w-full focus:bg-[#DEE4EC] pt-2 pl-2 pr-2 duration-300"
                  onClick={handleChangePassword}
                >
                  <h1 className="text-xl font-bold ">Change password</h1>
                  <div className="ml-2">
                    <ChevronRightIcon fontSize="small" />
                  </div>
                </animated.button>
              </div>
            )}
            {!dropdown && (
              <animated.div style={{ ...settings }} className="my-1">
                <h1 className="my-2">Settings</h1>
                <button className="flex flex-col  w-full focus:bg-[#DEE4EC] pt-2 pl-2 pr-2 duration-300">
                  <div className="flex justify-between w-full">
                    <h1 className="text-xl font-bold ">Language</h1>
                    <div className="flex">
                      <h1 className="">Eng</h1>
                      <div className="ml-2">
                        <ChevronRightIcon fontSize="small" />
                      </div>
                    </div>
                  </div>
                  <div className="h-[2px] w-full mt-2 bg-[#DEE4EC]"></div>
                </button>
              </animated.div>
            )}
            {dropdown && dropdownType === 'profile data' && (
              <div>
                <div>
                  <div>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex justify-center"
                    >
                      <div className="flex flex-col my-2">
                        <div className="">
                          <TextField
                            {...register('fullName', {
                              required: 'This field is required!',
                            })}
                            error={Boolean(errors.fullName?.message)}
                            helperText={errors.fullName?.message}
                            label="FullName"
                          />
                        </div>
                        <div className="mt-2">
                          <TextField
                            {...register('phone', {
                              required: 'This field is required!',
                            })}
                            error={Boolean(errors.phone?.message)}
                            helperText={errors.phone?.message}
                            label="Phone"
                          />
                        </div>
                        <div className="mt-2">
                          <TextField
                            {...register('address', {
                              required: 'This field is required!',
                            })}
                            error={Boolean(errors.address?.message)}
                            helperText={errors.address?.message}
                            label="Address"
                          />
                        </div>
                        <div className="mt-2">
                          <TextField
                            {...register('city', {
                              required: 'This field is required!',
                            })}
                            error={Boolean(errors.city?.message)}
                            helperText={errors.city?.message}
                            label="City"
                          />
                        </div>
                        <div className="mt-2">
                          <TextField
                            {...register('country', {
                              required: 'This field is required!',
                            })}
                            error={Boolean(errors.country?.message)}
                            helperText={errors.country?.message}
                            label="Country"
                          />
                        </div>
                        <div className="flex justify-center mt-2">
                          <button
                            type="submit"
                            className="w-[200px] h-[35px] bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 "
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button
                      className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
                      onClick={() => setDropdown((prev) => !prev)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {dropdown && dropdownType === 'change password' && (
              <div>
                <div className="flex justify-center">
                  <UpdatePasswordForm onSuccess={() => setDropdown(false)} />
                  <div>
                    {/* <div className="ml-2 mt-3">
                      {showPassword ? (
                        <button onClick={togglePasswordVisibility}>
                          <VisibilityOffOutlinedIcon fontSize="large" />
                        </button>
                      ) : (
                        <button onClick={togglePasswordVisibility}>
                          <VisibilityOutlinedIcon fontSize="large" />
                        </button>
                      )}
                    </div> */}
                  </div>
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
                    onClick={() => setDropdown((prev) => !prev)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {dropdown && dropdownType === 'change email' && (
              <div>
                <div>
                  <div className="flex justify-center">
                    <form className="flex justify-center ml-10">
                      <div className="flex flex-col my-2">
                        <div className="flex">
                          <TextField
                            {...register('oldPassword', {
                              required: 'This field is required!',
                            })}
                            error={Boolean(errors.oldPassword?.message)}
                            helperText={errors.oldPassword?.message}
                            label="Old password"
                            type={showPassword ? 'text' : 'password'}
                          />
                        </div>
                        <div className="mt-2 flex">
                          <TextField
                            {...register('password', {
                              required: 'This field is required!',
                            })}
                            error={Boolean(errors.password?.message)}
                            helperText={errors.password?.message}
                            label="New password"
                            type={showPassword ? 'text' : 'password'}
                          />
                        </div>
                        <div className="flex justify-center mt-2">
                          <button
                            type="submit"
                            className="w-full h-[35px] bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 "
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                    <div>
                      <div className="ml-2 mt-3">
                        {showPassword ? (
                          <button onClick={togglePasswordVisibility}>
                            <VisibilityOffOutlinedIcon fontSize="large" />
                          </button>
                        ) : (
                          <button onClick={togglePasswordVisibility}>
                            <VisibilityOutlinedIcon fontSize="large" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button
                      className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
                      onClick={() => setDropdown((prev) => !prev)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </animated.div>
        </animated.div>
      </animated.div>
    </div>
  )
}
