import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  Product,
  selectProducts,
} from '../redux/slices/products'
import { ProductForm } from '../assets/Product/ProductForm'
import { AnimatePresence, motion } from 'motion/react'
import { CircularProgress } from '@mui/material'

export const HomePage = () => {
  const dispatch = useDispatch()
  const { products, status } = useSelector(selectProducts)
  const [showLoading, setShowLoading] = useState<boolean>(true)

  const [state, setState] = useState({
    new: true,
    popular: false,
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (status === 'loading') {
      setShowLoading(true)
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [status])

  const getFilteredProducts = () => {
    if (!products || products.length === 0) return []

    return [...products].sort((a, b) => {
      if (state.new === true) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (state.popular === true) {
        return b.viewsCount - a.viewsCount
      }
      return 0
    })
  }

  const filteredProducts = getFilteredProducts()

  return (
    <div className="bg-[#FFFFFF]">
      <div>
        <div className="flex justify-between ml-5 mt-3">tags</div>
      </div>
      <div className="flex gap-7 ml-16 mt-7 text-xl relative ">
        <div className="">
          <button
            className=" px-3 py-1 "
            onClick={() => setState({ new: true, popular: false })}
          >
            <span className="w-10">New</span>
          </button>
        </div>
        <div>
          <button
            className="px-3 py-1 "
            onClick={() => setState({ new: false, popular: true })}
          >
            <span className="w-[67px]">Popular</span>
          </button>
        </div>

        <motion.div
          initial={{ x: 0 }}
          animate={{
            x: state.new ? '0%' : state.popular ? '100%' : '0%',
            width: state.new ? '64px' : state.popular ? '91px' : '0%',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`absolute bottom-0 w-[45px] bg-black/80  h-[2px]`}
        />
      </div>

      <div className="h-screen bg-[#FFFFFF] pt-3">
        <div className="m-3 mt-[30px]">
          <div className="flex flex-wrap justify-center gap-4">
            {status === 'succeeded' &&
              !showLoading &&
              filteredProducts.length > 0 &&
              filteredProducts.map((product: Product, index: number) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: Math.min(index * 0.1, 0.6),
                    duration: 0.5,
                  }}
                  key={product._id}
                  className="flex justify-between"
                >
                  <ProductForm product={product} />
                </motion.div>
              ))}
            <AnimatePresence>
              {(status === 'loading' || showLoading) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.5, delay: 0.2 },
                  }}
                  exit={{ opacity: 0 }}
                  className="w-screen flex justify-center"
                >
                  <CircularProgress
                    size={50}
                    sx={{
                      color: '#000',
                      position: 'absolute',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {status === 'failed' && (
          <span className=" flex justify-center text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent duration-300 transition-all ease-in-out">
            Something went wrong
          </span>
        )}
        {status === 'succeeded' && !showLoading && products.length === 0 && (
          <span className="flex justify-center text-2xl font-bold text-black duration-300 ">
            No products available
          </span>
        )}
      </div>
    </div>
  )
}
