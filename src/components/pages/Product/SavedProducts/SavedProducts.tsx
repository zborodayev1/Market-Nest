import { CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchProducts,
  selectProducts,
} from '../../../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../../../redux/store';
import { Product } from '../../../../redux/types/product.type';
import { ProductForm } from '../ProductForm/ProductForm';

export const SavedProducts = () => {
  const { products } = useSelector(selectProducts);
  const { status } = useSelector((state: RootState) => state.products);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit: 10,
        page: 1,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      setFavoriteProducts(
        products.filter((product: Product) => favorites.includes(product._id))
      );
    }
  }, [products]);

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

  return (
    <>
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
        }}
        className="w-screen"
      >
        <div className="flex w-full text-center  justify-center mt-5">
          <span className=" flex gap-1 items-center text-[#212121]">
            <h1 className="text-3xl font-bold">Saved items</h1>

            {favoriteProducts.length !== 0 && (
              <div className="flex flex-col">
                <span className="text-xl mt-1 text-gray-600">
                  <span>({totalCount} item)</span>
                </span>
              </div>
            )}
          </span>
        </div>

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
            exit={{ opacity: 0, transition: { delay: 0.1, duration: 0.5 } }}
          >
            <div className="flex flex-wrap justify-center gap-4">
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
                      className="flex justify-between mt-5"
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
                  <div className="">
                    <div className="flex justify-center my-3 items-center">
                      <div className="bg-[#e4e4e4] rounded-full p-4">
                        <Heart className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="text-center font-bold text-xl">
                      <p>You have no favorite products</p>
                    </div>
                    <div className="flex justify-center mt-5">
                      <Link
                        to="/"
                        className="px-4 py-2 w-35 bg-[#3C8737] font-bold text-white text-center rounded-full hover:bg-[#33722e]  transition-colors ease-linear duration-150 delay-50"
                      >
                        Shop Now
                      </Link>
                    </div>
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
