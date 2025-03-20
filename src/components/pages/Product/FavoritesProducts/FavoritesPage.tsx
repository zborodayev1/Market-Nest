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
import { PageSettingsForm } from '../../../forms/pageSettingsForm';
import { ProductForm } from '../ProductForm/ProductForm';

export const FavoritesPage = () => {
  const { products } = useSelector(selectProducts);

  const { totalPages, status } = useSelector(
    (state: RootState) => state.products
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const [PGState, setPGState] = useState<{ limit: number; page: number }>({
    limit: 10,
    page: 1,
  });
  const [limitError, setLimitError] = useState<boolean>(false);
  const [focusLimit, setFocusLimit] = useState<boolean>(false);
  const [focusPage, setFocusPage] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

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
    setFavorites(updatedFavorites);

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    setFavoriteProducts((prevFavorites) =>
      prevFavorites.filter((product: Product) => product._id !== id)
    );
    setTimeout(() => {
      setFavorites(updatedFavorites);
    }, 500);
  };

  const totalCount = favoriteProducts.length;

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

        {favoriteProducts.length > 0 && (
          <div className="flex justify-center">
            <span className="text-2xl text-[#212121]">
              <span className="font-bold">Count: </span>
              <span>{totalCount} items</span>
            </span>
          </div>
        )}

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
          {status !== 'loading' && (
            <PageSettingsForm
              open={open}
              setOpen={setOpen}
              limitError={limitError}
              setLimitError={setLimitError}
              PGState={PGState}
              setPGState={setPGState}
              totalPages={totalPages}
              focusLimit={focusLimit}
              setFocusLimit={setFocusLimit}
              focusPage={focusPage}
              setFocusPage={setFocusPage}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
