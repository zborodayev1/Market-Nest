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

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create product')
    }
  }
)

export const getProductsBySearch = createAsyncThunk(
  'products/getProductsBySearch',
  async (search: string) => {
    const { data } = await axios.post('/products/products-by-search', {
      search,
    })
    return data
  }
)

export const getProductsByTags = createAsyncThunk(
  'products/getProductsByTags',
  async (tags: string[]) => {
    const { data } = await axios.post('/products/products-by-tags', { tags })
    return data
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/products/${productId}`)
      return { productId }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete product')
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
  saveAmount: number
  discount: any
  save: number
  oldPrice: number
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
  reducers: {
    setProducts(state, action) {
      state.products = action.payload
    },
  },
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
      .addCase(getProductsByTags.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(
        getProductsByTags.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = 'succeeded'
          state.products = action.payload
        }
      )
      .addCase(getProductsByTags.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to fetch products by tags'
      })
      .addCase(getProductsBySearch.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(
        getProductsBySearch.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = 'succeeded'
          state.products = action.payload
        }
      )
      .addCase(getProductsBySearch.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to search products'
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = state.products.filter(
          (product) => product._id !== action.payload.productId
        )
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to delete product'
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = 'succeeded'
          state.products.push(action.payload)
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to create product'
      })
  },
})

export const productReducer = productSlice.reducer

export const selectProducts = (state: RootState) => state.products

export const { setProducts } = productSlice.actions
