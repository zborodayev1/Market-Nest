import { useEffect, useState } from 'react'
import {
  fetchProducts,
  Product,
  selectProducts,
} from '../../redux/slices/products'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { ProductForm } from './ProductForm'
import { AppDispatch } from '../../redux/store'

export const FavoritesPage = () => {
  const { products, status } = useSelector(selectProducts)
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    )
    setFavorites(storedFavorites)
  }, [])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (status === 'succeeded') {
      setFavoriteProducts(
        products.filter((product: Product) => favorites.includes(product._id))
      )
    }
  }, [status, products, favorites])

  const handleRemoveFromFavorites = (id: string) => {
    const updatedFavorites = favorites.filter((favoriteId) => favoriteId !== id)
    setFavorites(updatedFavorites)

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))

    setFavoriteProducts((prevFavorites) =>
      prevFavorites.filter((product: Product) => product._id !== id)
    )
    setTimeout(() => {
      setFavorites(updatedFavorites)
    }, 500)
  }

  const totalCount = favoriteProducts.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5, delay: 0.5 },
      }}
      className="w-screen"
    >
      <div className="flex w-full text-center items-center justify-center mt-5">
        <motion.span
          layout
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.5 },
          }}
          className="text-3xl font-bold text-[#212121]"
        >
          Favorites
        </motion.span>
      </div>
      <div className="flex justify-center">
        <span className="text-2xl text-[#212121]">
          <span className="font-bold">Count: </span>
          <span>{totalCount} items</span>
        </span>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -55 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.1, duration: 0.5 },
          }}
          exit={{ opacity: 0, y: -55 }}
        >
          <div className="flex flex-wrap justify-center mt-5 gap-4 min-h-[300px]">
            {status === 'succeeded' && favoriteProducts.length > 0 ? (
              <AnimatePresence>
                {favoriteProducts.map((product: Product, index: number) => (
                  <motion.div
                    layout
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.5 },
                    }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex justify-between"
                  >
                    <ProductForm
                      product={product}
                      onRemoveFavorite={handleRemoveFromFavorites}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center">
                <p>You have no favorite products</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
