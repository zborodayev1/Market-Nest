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

export const BagPage = () => {
  const { products, status } = useSelector(selectProducts)
  const [bag, setBag] = useState<string[]>([])
  const [bagProducts, setBagProducts] = useState<Product[]>([])
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const storedBag = JSON.parse(localStorage.getItem('bag') || '[]')
    setBag(storedBag)
  }, [])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (status === 'succeeded') {
      setBagProducts(
        products.filter((product: Product) => bag.includes(product._id))
      )
    }
  }, [status, products, bag])

  const handleRemoveFromBag = (id: string) => {
    setBagProducts((prevBag) =>
      prevBag.filter((product: Product) => product._id !== id)
    )

    const updatedBag = bag.filter((bagId) => bagId !== id)
    localStorage.setItem('bag', JSON.stringify(updatedBag))

    setTimeout(() => {
      setBag(updatedBag)
    }, 500)
  }
  const totalPrice = bagProducts.reduce(
    (total, product) => total + product.price,
    0
  )
  const totalCount = bagProducts.length
  return (
    <div className="w-screen ">
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.5, delay: 0.4 },
        }}
        className="flex flex-col w-full text-center items-center justify-center mt-2"
      >
        <span className="text-3xl font-bold text-[#212121] mb-2">Bag</span>
        <div className="my-1">
          <span className="text-2xl text-[#212121]">
            <span className="font-bold">Total:</span>{' '}
            <span className="bg-[#3C8737] text-white p-1 rounded-md">
              {totalPrice}$
            </span>
          </span>
        </div>
        <div>
          <span className="text-2xl text-[#212121]">
            <span className="font-bold">Count: </span>
            <span>{totalCount} items</span>
          </span>
        </div>
      </motion.div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.1, duration: 0.5 },
          }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-wrap justify-center mt-5 gap-4">
            {status === 'succeeded' && bagProducts.length > 0 && (
              <AnimatePresence>
                {bagProducts.map((product: Product, index: number) => (
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
                      onRemoveBag={handleRemoveFromBag}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {status === 'succeeded' && bagProducts.length === 0 && (
              <div className="text-center mt-4">
                <p>Your bag is empty</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
