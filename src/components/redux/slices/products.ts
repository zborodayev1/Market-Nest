import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from '../../../axios'
import { RootState } from '../store'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const { data } = await axios.get('/products')
    return data
  }
)

export const addToBag = createAsyncThunk(
  'products/addToBag',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/products/bag/${productId}`)
      return data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred'

      return rejectWithValue(errorMessage)
    }
  }
)

interface User {
  id: string
  fullName: string
}
export interface CartItem {
  product: Product
  quantity: number
}

export interface Product {
  _id: string
  name: string
  tags: string[]
  price: number
  description?: string
  viewsCount: number
  createdAt: string
  image: any
  user: User
  commentsCount: number
  favorite: boolean
}

interface ProductsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  products: Product[]
  cart: CartItem[]
}

const initialState: ProductsState = {
  products: [],
  status: 'idle',
  error: null,
  cart: [],
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.products = []
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = 'succeeded'
          state.products = action.payload
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Something went wrong'
      })
      .addCase(addToBag.fulfilled, (state, action) => {
        state.cart = action.payload.bag
      })
      .addCase(addToBag.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const productReducer = productSlice.reducer

export const selectProducts = (state: RootState) => state.products
