import { createSlice } from '@reduxjs/toolkit'

interface cacheState {
  error: string | null
}

const initialState: cacheState = {
  error: null,
}

const cacheSlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {},
  //   extraReducers: (builder) => {
  //     builder
  //   },
})

export const cacheReducer = cacheSlice.reducer

// следующий комит))
