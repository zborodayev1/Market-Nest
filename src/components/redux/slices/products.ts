import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from '../../../axios'
import { RootState } from '../store'
import { AxiosError } from 'axios'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(`/products?page=${page}&limit=${limit}`)
      return data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to load products'
        )
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
  }
)
export const fetchPendingProducts = createAsyncThunk(
  'products/fetchPendingProducts',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(
        `/products/products-pending?page=${page}&limit=${limit}`
      )
      return data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to load products'
        )
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to create product'
        )
      } else {
        return rejectWithValue('An unknown error occurred')
      }
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

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/products/${productId}`)
      return { productId }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to delete product'
        )
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
  }
)

export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async (
    { productId, status }: { productId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.patch(`/products/${productId}/status`, {
        status,
      })
      return data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Failed to update product status'
        )
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
  }
)

export const getOneProduct = createAsyncThunk<Product, string>(
  'products/getOneProduct',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/products/${id}`)
      return data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Failed to get product')
      } else {
        return rejectWithValue('An unknown error occurred')
      }
    }
  }
)

export interface Product {
  saveAmount: number
  discount: number | null
  save: number
  oldPrice: number
  _id: string
  name: string
  tags: string[]
  price: number
  description?: string
  viewsCount: number
  createdAt: string
  image: null | File
  user: string
  commentsCount: number
  favorite: boolean
  status: string
}

interface ProductsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  products: {
    products: Product[]
    total: number
    totalPages: number
    page: number
  }
  fullProduct: Product | null
}

const initialState: ProductsState = {
  products: {
    products: [],
    total: 0,
    totalPages: 0,
    page: 1,
  },
  status: 'idle',
  error: null,
  fullProduct: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products.products = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.products.products = []
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[]
            total: number
            totalPages: number
            page: number
          }>
        ) => {
          state.status = 'succeeded'
          state.products = action.payload
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Something went wrong'
      })
      .addCase(getProductsBySearch.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(
        getProductsBySearch.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = 'succeeded'
          state.products.products = action.payload
        }
      )
      .addCase(getProductsBySearch.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to find products'
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products.products = state.products.products.filter(
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
        (state, action: PayloadAction<{ product: Product }>) => {
          state.status = 'succeeded'
          state.products.products.push(action.payload.product)
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to create product'
      })
      .addCase(updateProductStatus.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const updatedProduct = action.payload
        const productIndex = state.products.products.findIndex(
          (product) => product._id === updatedProduct._id
        )
        if (productIndex !== -1) {
          state.products.products[productIndex] = updatedProduct
        }
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to update product status'
      })
      .addCase(fetchPendingProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.products.products = []
      })
      .addCase(
        fetchPendingProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[]
            total: number
            totalPages: number
            page: number
          }>
        ) => {
          state.status = 'succeeded'
          state.products = action.payload
        }
      )
      .addCase(fetchPendingProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load pending products'
      })
      .addCase(getOneProduct.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.fullProduct = null
      })
      .addCase(
        getOneProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = 'succeeded'
          state.fullProduct = action.payload
        }
      )
      .addCase(getOneProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  },
})

export const productReducer = productSlice.reducer

export const selectProducts = (state: RootState) => state.products

export const { setProducts } = productSlice.actions

export const selectFullProduct = (state: RootState) =>
  state.products.fullProduct
