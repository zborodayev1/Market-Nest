import { Avatar } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  selectIsAuth,
  selectUserProfile,
  fetchProfileData,
  logout,
} from '../../redux/slices/auth'
import { Navigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../../redux/store'
import CircularProgress from '@mui/material/CircularProgress'
import { UpdatePasswordForm } from './Forms/UpdatePasswordForm'
import { UpdateEmailForm } from './Forms/UpdateEmailForm'
import { UpdateDataForm } from './Forms/UpdateDataForm'
import { PersonalProfileData } from './assets/PersonalProfileData'
import { Languages } from '../../assets/Settings/Languagues'
import { selectLanguage } from '../../redux/slices/main'
import { persistor } from '../../redux/store'

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [redirect, setRedirect] = useState(false) // auth
  const [loadingError, setLoadingError] = useState(false) // for server loading
  const [dropdown, setDropdown] = useState(false) // for dropdowns: data, password, email
  const [dropdownType, setDropdownType] = useState('') // for dropdowns: data, password, email
  const [open, setOpen] = useState(0) // for log out
  const isAuth = useSelector(selectIsAuth)
  const userData = useSelector(selectUserProfile)

  const loading = useSelector((state: RootState) => state.auth.loading)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const { reset } = useForm({
    mode: 'onSubmit',
  })
  const language = useSelector(selectLanguage)

  const mainAnimation = useSpring({
    from: { width: 0, height: 0 },
    to: { width: 600, height: 650 },
    delay: 80,
  })

  const htmlAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 280,
  })

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
        window.location.reload()
      }
    }, 12000)

    return () => clearTimeout(timer)
  }, [isAuth, dispatch, reset, loading, userData, loadingProfile])

  const onClickLogout = async () => {
    setOpen((prev) => prev + 1)
  }

  useEffect(() => {
    if (open === 2) {
      dispatch(logout())
      localStorage.removeItem('token')
      persistor.purge()
      setOpen(0)
    }
  }, [open, dispatch])

  if (redirect) {
    return <Navigate to="/" />
  }
  let profileText
  if (dropdown) {
    profileText =
      language === 'enUS'
        ? 'Edit profile'
        : language === 'ruRU'
          ? 'Редактировать профиль'
          : 'Профильді енді'
  } else {
    profileText =
      language === 'enUS'
        ? 'Profile'
        : language === 'ruRU'
          ? 'Профиль'
          : 'Профиль'
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
              style={{ ...htmlAnimation }}
              className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
            >
              {profileText}
            </animated.h1>
          </div>
          <animated.div
            style={{ ...htmlAnimation }}
            className="flex justify-center mt-3"
          >
            <Avatar sx={{ width: 70, height: 70 }} src={userData?.avatarUrl} />
          </animated.div>

          <animated.div style={htmlAnimation}>
            {loadingError && (
              <div className="flex justify-center mt-2">
                <h1 className="text-red-500 font-bold">
                  {language === 'enUS'
                    ? 'Error: data not be loaded.'
                    : language === 'kkKZ'
                      ? 'Қате: деректер жүктелмеді.'
                      : 'Oшибка: данные не загружены.'}
                </h1>
              </div>
            )}
            {!userData && !loadingError && (
              <div className="flex justify-center mt-2">
                <h1>
                  {language === 'enUS'
                    ? 'Loading...'
                    : language === 'kkKZ'
                      ? 'Жүктелуде...'
                      : 'Загрузка...'}
                </h1>
                <div className="ml-2 mt-1">
                  <CircularProgress color="inherit" size="20px" />
                </div>
              </div>
            )}
            {userData && !dropdown && (
              <div>
                <PersonalProfileData
                  setDropdown={setDropdown}
                  setDropdownType={setDropdownType}
                  buttonStyle={{ ...htmlAnimation }}
                />
              </div>
            )}
            {!dropdown && (
              <animated.div style={{ ...htmlAnimation }} className="my-1">
                <h1 className="my-2">
                  {language === 'enUS'
                    ? 'Settings'
                    : language === 'kkKZ'
                      ? 'Параметрлері'
                      : 'Настройки'}
                </h1>
                <div className="mt-3">
                  <Languages />
                </div>
                {/* <div className="mt-5">
                  <Currency />
                </div> */}
              </animated.div>
            )}

            {dropdown && dropdownType === 'profile data' && (
              <div>
                <div>
                  <UpdateDataForm onSuccess={() => setDropdown(false)} />
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
                    onClick={() => setDropdown((prev) => !prev)}
                  >
                    {language === 'enUS'
                      ? 'Cancel'
                      : language === 'kkKZ'
                        ? 'Бас тарту'
                        : 'Назад'}
                  </button>
                </div>
              </div>
            )}
            {dropdown && dropdownType === 'change password' && (
              <div>
                <div className="flex justify-center">
                  <UpdatePasswordForm onSuccess={() => setDropdown(false)} />
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
                    onClick={() => setDropdown((prev) => !prev)}
                  >
                    {language === 'enUS'
                      ? 'Cancel'
                      : language === 'kkKZ'
                        ? 'Бас тарту'
                        : 'Назад'}
                  </button>
                </div>
              </div>
            )}
            {dropdown && dropdownType === 'change email' && (
              <div>
                <div className="flex justify-center">
                  <UpdateEmailForm onSuccess={() => setDropdown(false)} />
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
                    onClick={() => setDropdown((prev) => !prev)}
                  >
                    {language === 'enUS'
                      ? 'Cancel'
                      : language === 'kkKZ'
                        ? 'Бас тарту'
                        : 'Назад'}
                  </button>
                </div>
              </div>
            )}
            {!dropdown && (
              <animated.div
                style={{ ...htmlAnimation }}
                className="flex justify-center"
              >
                <button
                  onClick={onClickLogout}
                  className="w-[150px] h-10 bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 "
                >
                  {open === 1 ? 'Comfirm' : 'Log out'}
                </button>
                {open === 1 && (
                  <button
                    onClick={() => setOpen(0)}
                    className="ml-2 p-2 bg-red-500 rounded-md w-[100px] text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 duration-300"
                  >
                    No
                  </button>
                )}
              </animated.div>
            )}
          </animated.div>
        </animated.div>
      </animated.div>
    </div>
  )
}
