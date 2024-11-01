import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

const availableLanguages = ['enUS', 'ruRU', 'kkKZ'] as const
const availableCurrencies = ['USD', 'RUB', 'KZT', 'EUR'] as const

type Language = (typeof availableLanguages)[number]
type Currency = (typeof availableCurrencies)[number]

interface Settings {
  language: Language
  currency: Currency
}

const initialState: Settings = {
  language: 'enUS',
  currency: 'USD',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      if (availableLanguages.includes(action.payload)) {
        state.language = action.payload
      }
    },
    setCurrency: (state, action) => {
      if (availableCurrencies.includes(action.payload)) {
        state.currency = action.payload
      }
    },
  },
})

export const settingsReducer = settingsSlice.reducer

export const { setLanguage, setCurrency } = settingsSlice.actions

export const selectLanguage = (state: RootState): Language =>
  state.settings.language
export const selectCurrency = (state: RootState): Currency =>
  state.settings.currency
