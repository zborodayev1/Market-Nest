import { ProfileButton } from './ProfileButton'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../../../redux/slices/auth'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { selectLanguage } from '../../../redux/slices/main'

interface Props {
  setDropdown: (value: boolean) => void
  setDropdownType: (value: string) => void

  buttonStyle?: React.CSSProperties
}

export const PersonalProfileData = (props: Props) => {
  const { setDropdown, setDropdownType, buttonStyle } = props
  const userData = useSelector(selectUserProfile)
  const language = useSelector(selectLanguage)
  const handleChangeProfileData = () => {
    setDropdown(true)
    setDropdownType('profile data')
  }

  const handleChangePassword = () => {
    setDropdown(true)
    setDropdownType('change password')
  }

  const handleChangeEmail = () => {
    setDropdown(true)
    setDropdownType('change email')
  }

  return (
    <div className="my-1">
      <h1 className="my-2">
        {language === 'enUS'
          ? 'Personal data'
          : language === 'ruRU'
            ? 'Личные данные'
            : 'Жеке деректер'}
      </h1>
      <ProfileButton
        title={
          language === 'enUS' ? 'Name' : language === 'ruRU' ? 'Имя' : 'Аты'
        }
        value={userData.fullName}
        onClick={handleChangeProfileData}
        style={buttonStyle}
      />

      <ProfileButton
        title={
          language === 'enUS'
            ? 'E-mail'
            : language === 'ruRU'
              ? 'Почта'
              : 'Пошта'
        }
        value={userData.email}
        onClick={handleChangeEmail}
        style={buttonStyle}
      />

      <ProfileButton
        title={
          language === 'enUS'
            ? 'Phone'
            : language === 'ruRU'
              ? 'Телефон'
              : 'Телефон'
        }
        value={userData.phone || 'N/A'}
        onClick={handleChangeProfileData}
        style={buttonStyle}
      />

      <ProfileButton
        title={
          language === 'enUS'
            ? 'Addres'
            : language === 'ruRU'
              ? 'Aдрес'
              : 'Мекенжайы'
        }
        value={[userData.address, userData.city, userData.country]
          .filter(Boolean)
          .join(', ')}
        onClick={handleChangeProfileData}
        style={buttonStyle}
      />
      <button
        className="flex justify-between h-[46px] w-full focus:bg-[#DEE4EC] pt-2 pl-2 pr-2 duration-300"
        onClick={handleChangePassword}
      >
        <h1 className="text-xl font-bold ">
          {language === 'enUS'
            ? 'Change password'
            : language === 'ruRU'
              ? 'Изменить пароль'
              : 'Құпия сөзді өзгерту'}
        </h1>
        <div className="ml-2">
          <ChevronRightIcon fontSize="small" />
        </div>
      </button>
    </div>
  )
}
