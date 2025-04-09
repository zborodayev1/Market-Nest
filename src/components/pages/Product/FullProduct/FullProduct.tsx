import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Check, Clock, Eye, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { IoBag } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchDeliveryReq } from '../../../../redux/slices/deliverySlice';
import {
  getOneProduct,
  selectFullProduct,
} from '../../../../redux/slices/productSlice';
import { AppDispatch } from '../../../../redux/store';
import { DeliveryComponent } from './Delivery/DeliveryComponent';
import { SellerInfo } from './Seller/SellerInfo';

interface Props {
  noti?: boolean;
}

export const FullProduct = (props: Props) => {
  const { noti } = props;
  const data = useSelector(selectFullProduct);
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isBag, setIsBag] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const toggleFavorite = () => {
    if (!data) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== data._id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(data._id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    if (id) {
      dispatch(getOneProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchDeliveryReq());
  }, [dispatch]);

  const toggleBag = () => {
    if (!data) return;
    const bag = JSON.parse(localStorage.getItem('bag') || '[]');

    if (isBag) {
      const newBag = bag.filter((id: string) => id !== data._id);
      localStorage.setItem('bag', JSON.stringify(newBag));
    } else {
      bag.push(data._id);
      localStorage.setItem('bag', JSON.stringify(bag));
    }

    setIsBag(!isBag);
  };

  useEffect(() => {
    if (data) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(data._id));

      const bag = JSON.parse(localStorage.getItem('bag') || '[]');
      setIsBag(bag.includes(data._id));
    }
  }, [data]);

  if (!data) {
    return (
      <div className="w-screen fixed top-[200px] flex justify-center">
        <CircularProgress
          size={50}
          sx={{
            color: '#000',
            position: 'absolute',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Product - {data.name}</title>
        <meta
          name="description"
          content="Welcome to the homepage of Market Nest"
        />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests, homepage"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="ml-[200px] mt-5"
      >
        <div className="flex">
          <div className="text-2xl flex flex-col text-start">
            <div className="ml-2">
              <h1 className="text-3xl">{data.name}</h1>
              <div className="flex justify-start items-center gap-14">
                <div className="font-bold flex gap-2 my-1">
                  <h1
                    className={`text-2xl ${data.saveAmount ? 'text-[#ff3535]' : 'text-[#1f5e1c]'}`}
                  >
                    {data.price}$
                  </h1>
                  {data.saveAmount && (
                    <div className="text-lg flex gap-2 items-center">
                      <h1 className="bg-[#3C8737] text-white px-3 rounded-md p-1">
                        save {data.saveAmount}$
                      </h1>
                    </div>
                  )}
                </div>
                {noti && (
                  <div className="relative right-[50px]">
                    {data.status === 'approved' ? (
                      <h1 className="text-[#3C8737] gap-1 flex items-center font-bold">
                        Approved <Check className="w-7 h-7" />
                      </h1>
                    ) : data.status === 'rejected' ? (
                      <h1 className="text-red-600 gap-1 flex items-center font-bold">
                        Rejected <X />
                      </h1>
                    ) : (
                      <h1 className="text-blue-600 gap-1 flex items-center font-bold">
                        Pending <Clock />
                      </h1>
                    )}
                  </div>
                )}
              </div>
              <div className="flex text-[#a7a7a7]  items-center text-sm gap-2 mt-1 mb-5">
                <div className="flex gap-1">
                  {data.viewsCount} <Eye className="w-5 h-5 " />
                </div>

                <div className="flex gap-1">{data.createdAt}</div>
              </div>
            </div>

            <div className="flex gap-10">
              <img
                src={
                  data.image
                    ? typeof data.image === 'string'
                      ? data.image
                      : URL.createObjectURL(data.image)
                    : ''
                }
                className="max-w-[500px] bg-[#f5f5f5] rounded-md border"
              />
              <div className="">
                <DeliveryComponent />
                <div className="flex mt-5">
                  <div>
                    <motion.button
                      onClick={toggleBag}
                      className={`w-[450px] py-3 font-bold text-white text-lg cursor-pointer flex justify-center items-center gap-2 rounded-xl   ${isBag ? 'bg-[#873737] active:bg-gradient-to-r active:from-[#873737] active:via-transparent active:to-[#3C8737]' : 'bg-[#3C8737] active:bg-gradient-to-r active:from-[#3C8737] active:via-transparent active:to-[#873737] '} transition-colors duration-200 ease- delay-50`}
                      style={{ overflow: 'hidden' }}
                    >
                      <motion.span
                        key={isBag ? 'add' : 'remove'}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                          delay: 0.2,
                        }}
                      >
                        {isBag ? 'Remove from bag' : 'Add to bag'}
                      </motion.span>
                      {!isBag ? (
                        <motion.div
                          className="absolute"
                          initial={{ x: 95 }}
                          animate={{ x: 65 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                            delay: 0,
                          }}
                        >
                          <IoBag />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="absolute"
                          initial={{ x: 65 }}
                          animate={{ x: 95 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,

                            delay: 0,
                          }}
                        >
                          <X size={23} />
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                  <div className="ml-1">
                    <IconButton
                      onClick={toggleFavorite}
                      className="flex w-[50px] h-[50px] text-2xl text-[#fd3939] transition-opacity duration-300 ease-in-out 
                  "
                      color="error"
                    >
                      {isFavorite ? (
                        <FavoriteOutlinedIcon
                          style={{ width: 28, height: 28 }}
                        />
                      ) : (
                        <FavoriteBorderOutlinedIcon
                          style={{ width: 28, height: 28 }}
                        />
                      )}
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-5  border-gray-500 border max-w-[500px] min-w-[400px] rounded-md p-5">
              <div>
                <h1 className="text-2xl font-bold">Seller info</h1>
              </div>
              <div>
                <SellerInfo user={data.user} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
