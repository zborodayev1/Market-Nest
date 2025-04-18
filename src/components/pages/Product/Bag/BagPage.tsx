import CircularProgress from '@mui/material/CircularProgress';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectProducts,
} from '../../../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../../../redux/store';
import { Product } from '../../../../redux/types/product.type';

import { ProductForm } from '../ProductForm/ProductForm';

export const BagPage = () => {
  const { products } = useSelector(selectProducts);
  const { status } = useSelector((state: RootState) => state.products);
  const [bag, setBag] = useState<string[]>([]);
  const [bagProducts, setBagProducts] = useState<Product[]>([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const storedBag = JSON.parse(localStorage.getItem('bag') || '[]');
    setBag(storedBag);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 20, page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      setBagProducts(
        products.filter((product: Product) => bag.includes(product._id))
      );
    }
  }, [status, products, bag]);

  const handleRemoveFromBag = (id: string) => {
    const updatedBag = bag.filter((bagId) => bagId !== id);

    setBagProducts((prevBag) =>
      prevBag.filter((product: Product) => product._id !== id)
    );

    localStorage.setItem('bag', JSON.stringify(updatedBag));

    setBag(updatedBag);
  };
  const totalPrice = bagProducts.reduce(
    (total, product) => total + product.price,
    0
  );
  const totalCount = bagProducts.length;
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

      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
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
                <span className="font-bold">Total Price: </span>
                <span className="bg-[#3C8737] text-white px-2 p-1 rounded-md">
                  {totalPrice}$
                </span>
              </span>

              <span className="text-xl mt-1 text-[#212121]">
                <span className="font-bold">Product Count: </span>
                <span>{totalCount} products</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {status === 'loading' && (
        <div className="flex justify-center m-5">
          <CircularProgress color="inherit" />
        </div>
      )}
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
            {status === 'succeeded' && bagProducts.length > 0 ? (
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
            ) : (
              status !== 'loading' && (
                <div className="text-center font-bold text-xl">
                  <p>Your bag is empty</p>
                </div>
              )
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
