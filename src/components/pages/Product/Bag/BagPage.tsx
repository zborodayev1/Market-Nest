import { useEffect, useState } from 'react'
import {
  fetchProducts,
  Product,
  selectProducts,
} from '../../../redux/slices/products'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { ProductForm } from '../ProductForm/ProductForm'
import { AppDispatch } from '../../../redux/store'
import { Helmet } from 'react-helmet-async'
import { PageSettingsForm } from '../../../forms/pageSettingsForm'

export const BagPage = () => {
  const { products, status } = useSelector(selectProducts)
  const [bag, setBag] = useState<string[]>([])
  const [bagProducts, setBagProducts] = useState<Product[]>([])
  const dispatch: AppDispatch = useDispatch()
  const [PGState, setPGState] = useState<{ limit: number; page: number }>({
    limit: 10,
    page: 1,
  })
  const [limitError, setLimitError] = useState<boolean>(false)
  const [focusLimit, setFocusLimit] = useState<boolean>(false)
  const [focusPage, setFocusPage] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const storedBag = JSON.parse(localStorage.getItem('bag') || '[]')
    setBag(storedBag)
  }, [])

  useEffect(() => {
    dispatch(fetchProducts({ limit: 20, page: 1 }))
  }, [dispatch])

  useEffect(() => {
    if (status === 'succeeded') {
      setBagProducts(
        products.products.filter((product: Product) =>
          bag.includes(product._id)
        )
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
      <Helmet>
        <title>Market Nest - Bag</title>
        <meta name="description" content="Welcome to the bag of Market Nest" />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests, bag"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.5, delay: 1 },
        }}
        className="absolute top-[120px]"
      >
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
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.5 },
        }}
        className="flex justify-center mt-2 text-3xl font-bold text-[#212121] mb-2"
      >
        Bag
      </motion.span>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        className="flex flex-col w-full text-center items-center justify-center mt-2"
      >
        <AnimatePresence>
          {bagProducts.length !== 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="text-2xl text-[#212121]">
                <span className="font-bold">Total: </span>
                <span className="bg-[#3C8737] text-white p-1 rounded-md">
                  {totalPrice}$
                </span>
              </span>

              <span className="text-2xl text-[#212121]">
                <span className="font-bold">Count: </span>
                <span>{totalCount} items</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
          <div
            className={`flex flex-wrap justify-center ${bagProducts.length === 0 ? 'mt-1' : 'mt-5'} gap-4`}
          >
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
              <div className="text-center text-xl font-bold mt-2">
                <p>Your bag is empty</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
