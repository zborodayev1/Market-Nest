import { CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { MoveLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  fetchProducts,
  selectProducts,
} from '../../../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../../../redux/store';
import { Product } from '../../../../redux/types/product.type';
import { ProductForm } from '../ProductForm/ProductForm';

export const ProductsByTags = () => {
  const { selectedTag } = useParams();

  const { products } = useSelector(selectProducts);
  const { status } = useSelector((state: RootState) => state.products);
  const dispatch: AppDispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(
      fetchProducts({
        limit: 10,
        page: 1,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit: 10,
        page: 1,
      })
    );
  }, [dispatch]);

  const getFilteredProducts = () => {
    if (!Array.isArray(products) || products.length === 0) return [];
    if (selectedTag === 'All') {
      return products;
    }
    return products
      .filter((product: Product) => product.status !== 'pending')
      .filter((product: Product) => product.status !== 'rejected')
      .filter((product: Product) => {
        if (!selectedTag) return true;
        return product.tags.includes(selectedTag);
      });
  };

  const filteredProducts = status === 'succeeded' ? getFilteredProducts() : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mt-5 flex justify-start ml-10 text-2xl font-bold">
        <Link
          className="flex items-center gap-2 mx-2 underline text-[#1266CD] hover:text-[#1266CD]/75 transition-colors duration-150 ease-linear delay-50"
          to="/"
        >
          <MoveLeft />
          Home
        </Link>
        <h1 className="cursor-default gap-2">/ {selectedTag}</h1>
      </div>

      <div className="">
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              filter: 'blur(5px)',
            }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mt-5"
          >
            <CircularProgress color="inherit" />
          </motion.div>
        )}
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
              <b className="ml-1 italic cursor-pointer">page</b>
            </button>
          </motion.span>
        )}
      </div>
      <div className="h-screen bg-[#FFFFFF]">
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
        </div>
      </div>
    </motion.div>
  );
};
