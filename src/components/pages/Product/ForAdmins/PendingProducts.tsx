import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingProducts,
  selectProducts,
  updateProductStatus,
} from '../../../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../../../redux/store';

import { ProductForm } from '../ProductForm/ProductForm';

import { toast } from 'react-toastify';
import { Product } from '../../../../redux/types/product.type';

export const PendingProducts = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products } = useSelector(selectProducts);
  const { status } = useSelector((state: RootState) => state.products);
  const [PGState, setPGState] = useState<{ limit: number; page: number }>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    dispatch(
      fetchPendingProducts({ page: PGState.page, limit: PGState.limit })
    );
  }, [dispatch, PGState]);

  const filteredProducts = (products || []).filter(
    (product: Product) => product.status === 'pending'
  );

  const handleUpdateStatus = async (productId: string, newStatus: string) => {
    try {
      await dispatch(
        updateProductStatus({ productId, status: newStatus })
      ).unwrap();
      dispatch({
        type: 'products/setProducts',
        payload: filteredProducts.filter(
          (product: Product) => product._id !== productId
        ),
      });
      toast('Successfully update product status to success!', {
        type: 'success',
        position: 'top-right',
      });
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  const onSubmit = (productId: string) => {
    handleUpdateStatus(productId, 'approved');
  };

  return (
    <>
      <Helmet>
        <title>Pending Products</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
      </motion.div>
    </>
  );
};
