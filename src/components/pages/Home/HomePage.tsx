import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  getProductsByTags,
  Product,
  selectProducts,
} from '../../redux/slices/products'
import { ProductForm } from '../../assets/Product/ProductForm'
import { motion } from 'motion/react'
import { AppDispatch } from '../../redux/store'

export const HomePage = () => {
  const dispatch: AppDispatch = useDispatch()
  const { products, status } = useSelector(selectProducts)
  const [state, setState] = useState({
    new: true,
    popular: false,
  })
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

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (selectedTags.length > 0) {
      dispatch(getProductsByTags(selectedTags))
    }
  }, [selectedTags, dispatch])

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) => {
      const updatedTags = prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]

      if (updatedTags.length === 0) {
        dispatch(fetchProducts())
      } else {
        dispatch(getProductsByTags(updatedTags))
      }

      return updatedTags
    })
  }

  const getFilteredProducts = () => {
    if (!products || products.length === 0) return []

    return [...products]
      .filter((product) => product.status !== 'pending')
      .sort((a, b) => {
        if (state.new === true) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        } else if (state.popular === true) {
          return b.viewsCount - a.viewsCount
        }
        return 0
      })
  }

  const filteredProducts =
    selectedTags.length === 0
      ? getFilteredProducts()
      : products
          .filter((product: unknown) =>
            (product as { tags: string[] }).tags.some((tag) =>
              selectedTags.includes(tag)
            )
          )
          .filter((product: Product) => product.status !== 'pending')
          .filter((product: Product) => product.status !== 'rejected')

  return (
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
            <button
              className={`px-4 py-1 rounded-lg transition-colors ease-in-out duration-300 
                       focus:bg-[#3C8737] focus:text-white
                       bg-gray-200 text-gray-800
                   hover:bg-[#2B6128] hover:text-white`}
              onClick={() => setState({ new: true, popular: false })}
            >
              New
            </button>
            <button
              className={`px-4 py-1 rounded-lg transition-colors ease-in-out duration-300 
                    focus:bg-[#3C8737] focus:text-white
                    bg-gray-200 text-gray-800
                hover:bg-[#2B6128] hover:text-white`}
              onClick={() => setState({ new: false, popular: true })}
            >
              Popular
            </button>
            {availableTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-1 rounded-lg transition-colors ease-in-out duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-[#3C8737] text-white'
                    : 'bg-gray-200 text-gray-800'
                } hover:bg-[#2B6128] hover:text-white`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="h-screen bg-[#FFFFFF] pt-3">
        <div className="m-3 mt-6">
          <div className="flex flex-wrap justify-center gap-4">
            {status === 'succeeded' &&
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
          </div>
        </div>
        {status === 'failed' && (
          <span className=" flex justify-center text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent duration-300 transition-all ease-in-out">
            Something went wrong
          </span>
        )}
        {status === 'succeeded' && filteredProducts.length === 0 && (
          <span className="flex justify-center text-2xl font-bold text-black duration-300 ">
            No products available
          </span>
        )}
      </div>
    </motion.div>
  )
}
