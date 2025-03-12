import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  Product,
  selectProducts,
} from '../../redux/slices/products'
import { ProductForm } from '../Product/ProductForm/ProductForm'
import { AnimatePresence, motion } from 'motion/react'
import { AppDispatch } from '../../redux/store'
import { CircularProgress } from '@mui/material'
import { PageSettingsForm } from '../../forms/pageSettingsForm'
import { Helmet } from 'react-helmet-async'
import { fetchNotificationCount } from '../../redux/slices/notifications'

export const HomePage = () => {
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
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const availableTags = [
    'Clothes',
    'Electronics',
    'House & Garden',
    'Construction and repair',
    'Sport',
    "Children's products",
    'Decorations and luxury',
  ]

  const handleRefresh = () => {
    dispatch(
      fetchProducts({
        limit: PGState.limit,
        page: PGState.page,
      })
    )
  }

  const crearFilrers = () => {
    setSelectedTags([])
  }

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit: PGState.limit,
        page: PGState.page,
      })
    )
  }, [dispatch, PGState])

  useEffect(() => {
    dispatch(fetchNotificationCount())
  }, [dispatch])

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    )
  }

  const getFilteredProducts = () => {
    if (!Array.isArray(products.products) || products.products.length === 0)
      return []

    return products.products
      .filter((product: Product) => product.status !== 'pending')
      .filter((product: Product) => product.status !== 'rejected')
      .filter((product: Product) => {
        if (selectedTags.length === 0) return true
        return selectedTags.every((tag) => product.tags.includes(tag))
      })
  }

  const filteredProducts = status === 'succeeded' ? getFilteredProducts() : []

  return (
    <>
      <Helmet>
        <title>Market Nest</title>
        <meta
          name="description"
          content="Welcome to the homepage of Market Nest"
        />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests, homepage"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-[#FFFFFF]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          className="text-xl"
        >
          <div className="flex mt-7 relative overflow-hidden">
            <motion.div
              className="flex gap-4 whitespace-nowrap px-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                display: 'flex',
                overflowX: 'auto',
              }}
            >
              {availableTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1 rounded-lg transition-colors ease-in-out duration-300 ${
                    selectedTags.includes(tag)
                      ? 'bg-[#2B6128] text-white hover:bg-[#3C8737]'
                      : 'bg-gray-200 text-gray-800 hover:bg-[#1f5e1c]'
                  }  hover:text-white`}
                >
                  {tag}
                </button>
              ))}
              <AnimatePresence>
                {selectedTags.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: 50, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: 50, filter: 'blur(5px)' }}
                    onClick={crearFilrers}
                    className=" px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors ease-in-out duration-300"
                  >
                    Clear Filters
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          <div className="">
            {status === 'failed' && (
              <motion.span
                initial={{ opacity: 0, filter: 'blur(5px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  filter: 'blur(5px)',
                  transition: { duration: 0.4 },
                }}
                className="flex mt-5 justify-center text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"
              >
                Something went wrong
              </motion.span>
            )}
            {status === 'succeeded' && filteredProducts.length === 0 && (
              <motion.span
                initial={{ opacity: 0, filter: 'blur(5px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  filter: 'blur(5px)',
                  transition: { duration: 0.4 },
                }}
                className="mt-5 flex justify-center text-2xl font-bold text-black"
              >
                No products available, Try to refresh the{' '}
                <button onClick={handleRefresh} className="z-20">
                  <b className="ml-1">page</b>
                </button>
              </motion.span>
            )}
            {status === 'loading' && (
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  filter: 'blur(5px)',
                }}
                transition={{ duration: 0.4 }}
                className="flex justify-center items-center mt-5"
              >
                <CircularProgress color="inherit" />
              </motion.div>
            )}
          </div>
        </AnimatePresence>
        <div className="h-screen bg-[#FFFFFF] pt-3">
          <div className="mx-3">
            <AnimatePresence>
              <div className="flex mt-5 flex-wrap justify-center gap-4">
                {filteredProducts.length > 0 &&
                  filteredProducts.map((product: Product, index: number) => (
                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        delay: Math.min(index * 0.1, 0.6),
                        duration: 0.3,
                      }}
                      key={product._id}
                      exit={{ opacity: 0, filter: 'blur(5px)' }}
                      className="flex justify-between"
                    >
                      <ProductForm product={product} />
                    </motion.div>
                  ))}
              </div>
            </AnimatePresence>
            {status !== 'loading' && (
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
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
