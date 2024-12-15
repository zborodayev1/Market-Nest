import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  Product,
  selectProducts,
  updateProductStatus,
} from '../../redux/slices/products'
import { AppDispatch } from '../../redux/store'
import { useEffect } from 'react'
import { ProductForm } from '../../assets/Product/ProductForm'
import { motion } from 'motion/react'

import { createNotification } from '../../redux/slices/notifications'

export const PendingProducts = () => {
  const dispatch: AppDispatch = useDispatch()
  const { products } = useSelector(selectProducts)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const filteredProducts = products.filter(
    (product: Product) => product.status === 'pending'
  )

  const handleUpdateStatus = async (productId: string, newStatus: string) => {
    try {
      await dispatch(
        updateProductStatus({ productId, status: newStatus })
      ).unwrap()

      await dispatch(
        createNotification({
          title:
            newStatus === 'approved' ? 'Product Approved' : 'Product Rejected',
          actionType: newStatus === 'approved' ? 'approved' : 'rejected',
          message: 'Product Status Change',
          productId,
        })
      ).unwrap()
    } catch (error) {
      console.log(
        'Updating product with ID:',
        productId,
        'to status:',
        newStatus
      )
      console.error('Failed to update product status:', error)
    }
  }

  const onSubmit = (productId: string) => {
    handleUpdateStatus(productId, 'approved')
  }

  const onReject = (productId: string) => {
    handleUpdateStatus(productId, 'rejected')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-[#FFFFFF] pt-3"
    >
      <h1 className="flex justify-center text-3xl font-bold">
        Pending Products
      </h1>
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
                onReject={() => onReject(product._id)}
              />
            </motion.div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-center text-xl text-[#000000] font-bold">
              No pending products
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
