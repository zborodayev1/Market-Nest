import { CircularProgress } from '@mui/material';
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

export const FavoritesPage = () => {
  const { products } = useSelector(selectProducts);
  const { status } = useSelector((state: RootState) => state.products);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const [PGState, setPGState] = useState<{ limit: number; page: number }>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit: PGState.limit,
        page: PGState.page,
      })
    );
  }, [dispatch, PGState]);

  useEffect(() => {
    if (status === 'succeeded') {
      setFavoriteProducts(
        products.filter((product: Product) => favorites.includes(product._id))
      );
    }
  }, [status, products, favorites]);

  const handleRemoveFromFavorites = (id: string) => {
    const updatedFavorites = favorites.filter(
      (favoriteId) => favoriteId !== id
    );

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    setFavorites(updatedFavorites);

    setFavoriteProducts(
      products.filter((product) => updatedFavorites.includes(product._id))
    );
  };

  const totalCount = favoriteProducts.length;

  const totalPrice = favoriteProducts.reduce(
    (total, product) => total + product.price,
    0
  );
  return (
    <>
      {' '}
      <Helmet>
        <title>Market Nest - Favorites</title>
        <meta
          name="description"
          content="Welcome to the favorite of Market Nest"
        />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests, favorite"
        />
      </Helmet>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          className="flex flex-col w-full text-center items-center justify-center mt-2"
        >
          <AnimatePresence>
            {favoriteProducts.length !== 0 && (
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
            <div className="flex flex-wrap justify-center mt-5 gap-4 ">
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
                status !== 'loading' && (
                  <div className="text-center font-bold text-xl">
                    <p>You have no favorite products</p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
};
