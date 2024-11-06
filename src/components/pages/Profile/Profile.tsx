import { Avatar } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  selectIsAuth,
  selectUserProfile,
  fetchProfileData,
} from '../../redux/slices/auth'
import { Navigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../../redux/store'
import CircularProgress from '@mui/material/CircularProgress'
import { UpdatePasswordForm } from './Forms/UpdatePasswordForm'
import { UpdateEmailForm } from './Forms/UpdateEmailForm'
import { UpdateDataForm } from './Forms/UpdateDataForm'
import { PersonalProfileData } from './assets/PersonalProfileData'
import { Languages } from './Settings/Languagues'
import { Currency } from './Settings/Currency'
import { selectLanguage } from '../../redux/slices/main'

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [redirect, setRedirect] = useState(false)
  const [loadingError, setLoadingError] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [dropdownType, setDropdownType] = useState('')
  const isAuth = useSelector(selectIsAuth)
  const userData = useSelector(selectUserProfile)
  const loading = useSelector((state: RootState) => state.auth.loading)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const { reset } = useForm({
    mode: 'onSubmit',
  })
  const language = useSelector(selectLanguage)

  const button = useSpring({
    from: { opacity: 0, y: 100, width: 0, height: 0 },
    to: { opacity: 1, y: 0, width: 572, height: 46 },
    delay: 500,
  })

  const settings = useSpring({
    from: { opacity: 0, y: 100, width: 0, height: 0 },
    to: { opacity: 1, y: 0, width: 572, height: 46 },
    delay: 1100,
  })

  const mainAnimation = useSpring({
    from: { width: 0, height: 0 },
    to: { width: 600, height: 650 },
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

  if (redirect) {
    return <Navigate to="/" />
  }
  let profileText
  if (loading && dropdown) {
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
              style={{ ...textAnimation }}
              className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
            >
              {profileText}
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
                  buttonStyle={{ ...button }}
                />
              </div>
            )}
            {!dropdown && (
              <animated.div style={{ ...settings }} className="my-1">
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
                <div className="mt-5">
                  <Currency />
                </div>
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
          </animated.div>
        </animated.div>
      </animated.div>
    </div>
  )
}
