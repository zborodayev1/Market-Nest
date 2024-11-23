import { useSelector, useDispatch } from 'react-redux'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import * as locales from '@mui/material/locale'
import { selectLanguage, setLanguage } from '../../redux/slices/main'

const supportedLocales = {
  enUS: locales.enUS,
  ruRU: locales.ruRU,
  kkKZ: locales.kkKZ,
}

export const Languages = () => {
  const dispatch = useDispatch()
  const language = useSelector(selectLanguage)

  const currentLocale = language

  const handleLanguageChange = (event: any, newValue: string | null) => {
    if (newValue) {
      dispatch(setLanguage(newValue as keyof typeof supportedLocales))
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        options={Object.keys(supportedLocales)}
        getOptionLabel={(key) => {
          const languageMap: Record<string, string> = {
            enUS: 'English',
            ruRU: 'Русский',
            kkKZ: 'Қазақша',
          }
          return languageMap[key as keyof typeof languageMap] || key
        }}
        style={{ width: '100%' }}
        value={currentLocale}
        disableClearable
        onChange={handleLanguageChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              language === 'ruRU'
                ? 'Язык'
                : language === 'kkKZ'
                  ? 'Тiл'
                  : 'Language'
            }
            helperText={
              language === 'ruRU'
                ? 'Выберите язык'
                : language === 'kkKZ'
                  ? 'Тілді таңдаңыз'
                  : 'Choose language'
            }
            fullWidth
          />
        )}
      />
    </Box>
  )
}
