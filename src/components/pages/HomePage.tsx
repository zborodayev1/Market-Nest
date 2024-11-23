// import { animated, useSpring } from '@react-spring/web'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  Product,
  selectProducts,
} from '../redux/slices/products'
import { ProductForm } from '../assets/Product/ProductForm'
import { motion } from 'motion/react'
import { CircularProgress } from '@mui/material'
export const HomePage = () => {
  const dispatch = useDispatch()
  const { products, status } = useSelector(selectProducts)
  const [showLoading, setShowLoading] = useState<boolean>(true)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (status === 'succeeded') {
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (status === 'loading') {
      setShowLoading(true)
    }
  }, [status])

  return (
    <div className="h-screen bg-[#16151A] pt-5">
      <div className="m-3 mt-[30px]">
        <div className="flex flex-wrap gap-4">
          {status === 'succeeded' &&
            !showLoading &&
            products.length > 0 &&
            products.map((product: Product, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                key={product._id}
                className="flex justify-between"
              >
                <ProductForm product={product} />
              </motion.div>
            ))}
          {((status === 'loading' && status !== 'failed') || showLoading) && (
            <div className="w-screen flex justify-center">
              <CircularProgress
                size={50}
                sx={{
                  color: '#7e2dff',
                  position: 'absolute',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            </div>
          )}
        </div>
      </div>
      {status === 'failed' && (
        <span
          style={{
            textShadow:
              '2px 2px 6px rgba(220, 38, 38, 0.6), -2px -2px 6px rgba(220, 38, 38, 0.6)',
          }}
          className="mt-[50px] flex justify-center text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent duration-300 transition-all ease-in-out"
        >
          Something went wrong
        </span>
      )}
      {status === 'succeeded' && !showLoading && products.length === 0 && (
        <span className="flex justify-center text-2xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] bg-clip-text text-transparent duration-300 transition-all ease-in-out ">
          No products available
        </span>
      )}
    </div>
  )
}
