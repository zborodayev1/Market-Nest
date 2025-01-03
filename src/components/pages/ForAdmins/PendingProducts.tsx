import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPendingProducts,
  Product,
  selectProducts,
  updateProductStatus,
} from '../../redux/slices/products'
import { AppDispatch } from '../../redux/store'
import { useEffect, useState } from 'react'
import { ProductForm } from '../../assets/Product/ProductForm'
import { motion } from 'motion/react'
import { Helmet } from 'react-helmet-async'
import { PageSettingsForm } from '../../forms/pageSettingsForm'
import { CircularProgress } from '@mui/material'

export const PendingProducts = () => {
  const dispatch: AppDispatch = useDispatch()
  const { products, status } = useSelector(selectProducts)
  const [PGState, setPGState] = useState<{ limit: number; page: number }>({
    limit: 10,
    page: 1,
  })
  const [limitError, setLimitError] = useState<boolean>(false)
  const [focusLimit, setFocusLimit] = useState<boolean>(false)
  const [focusPage, setFocusPage] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchPendingProducts({ page: PGState.page, limit: PGState.limit }))
  }, [dispatch, PGState])

  const filteredProducts = (products.products || []).filter(
    (product: Product) => product.status === 'pending'
  )

  const handleUpdateStatus = async (productId: string, newStatus: string) => {
    try {
      await dispatch(
        updateProductStatus({ productId, status: newStatus })
      ).unwrap()
      dispatch({
        type: 'products/setProducts',
        payload: filteredProducts.filter(
          (product: Product) => product._id !== productId
        ),
      })
    } catch (error) {
      console.error('Failed to update product status:', error)
    }
  }

  const onSubmit = (productId: string) => {
    handleUpdateStatus(productId, 'approved')
  }

  return (
    <>
      <Helmet>
        <title>Pending Products</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-screen bg-[#FFFFFF] pt-3"
      >
        <h1 className="flex justify-center text-3xl font-bold">
          Pending Products
        </h1>
        <div className="mb-[20px]">
          <PageSettingsForm
            open={open}
            setOpen={setOpen}
            limitError={limitError}
            setLimitError={setLimitError}
            PGState={PGState}
            setPGState={setPGState}
            products={products}
            focusLimit={focusLimit}
            setFocusLimit={setFocusLimit}
            focusPage={focusPage}
            setFocusPage={setFocusPage}
          />
        </div>
        {status === 'loading' && (
          <div className="flex justify-center">
            <CircularProgress color="inherit" />
          </div>
        )}
        {status !== 'loading' && (
          <div className="m-3 mt-6">
            <div className="flex flex-wrap justify-center gap-4">
              {filteredProducts.map((product: Product, index: number) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: Math.min(index * 0.1, 0.6),
                    duration: 0.5,
                  }}
                  key={product._id}
                  className="flex justify-between"
                  layout
                >
                  <ProductForm
                    product={product}
                    Pending
                    onSubmit={() => onSubmit(product._id)}
                  />
                </motion.div>
              ))}
              {filteredProducts.length === 0 && status !== 'loading' && (
                <p className="text-center text-xl text-[#000000] font-bold">
                  No pending products
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
