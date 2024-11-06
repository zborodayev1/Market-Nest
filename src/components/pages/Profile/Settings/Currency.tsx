import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import {
  selectCurrency,
  selectLanguage,
  setCurrency,
} from '../../../redux/slices/main'

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'RUB',
    label: '₽',
  },
  {
    value: 'KZT',
    label: '₸',
  },
  {
    value: 'EUR',
    label: '€',
  },
]

export const Currency = () => {
  const dispatch = useDispatch()
  const currency = useSelector(selectCurrency)
  const language = useSelector(selectLanguage)

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrency(event.target.value))
  }

  return (
    <Box>
      <TextField
        id="outlined-select-currency"
        select
        fullWidth
        label={
          language === 'ruRU'
            ? 'Валюта'
            : language === 'kkKZ'
              ? 'Валюта'
              : 'Currency'
        }
        value={currency}
        onChange={handleCurrencyChange}
        helperText={
          language === 'ruRU'
            ? 'Выберите валюту'
            : language === 'kkKZ'
              ? 'Тақырыпты таңдаңыз'
              : 'Choose currency'
        }
        variant="outlined"
      >
        {currencies.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}
