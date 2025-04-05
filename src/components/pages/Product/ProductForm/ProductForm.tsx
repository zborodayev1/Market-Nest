import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { IconButton } from '@mui/material';
import { Eye, Pencil, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { BiSolidMessageSquare } from 'react-icons/bi';
import { IoBag } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserProfile } from '../../../../redux/slices/authSlice';
import { deleteProduct } from '../../../../redux/slices/productSlice';
import { AppDispatch } from '../../../../redux/store';
import { Product } from '../../../../redux/types/product.type';

interface ProductFormProps {
  product: Product;
  onRemoveFavorite?: (id: string) => void;
  onRemoveBag?: (id: string) => void;
  Pending?: boolean;
  Rejected?: boolean;
  onSubmit?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onRemoveFavorite,
  onRemoveBag,
  Pending,
  Rejected,
  onSubmit,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const userData = useSelector(selectUserProfile);
  const [isBag, setIsBag] = useState<boolean>(false);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== product._id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));

      if (onRemoveFavorite) onRemoveFavorite(product._id);
    } else {
      favorites.push(product._id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    setIsFavorite(!isFavorite);
  };

  const toggleBag = () => {
    const bag = JSON.parse(localStorage.getItem('bag') || '[]');

    if (isBag) {
      const newBag = bag.filter((id: string) => id !== product._id);
      localStorage.setItem('bag', JSON.stringify(newBag));
      if (onRemoveBag) onRemoveBag(product._id);
    } else {
      bag.push(product._id);
      localStorage.setItem('bag', JSON.stringify(bag));
    }

    setIsBag(!isBag);
  };

  const handleDelete = async (productId: string) => {
    dispatch(deleteProduct(productId));
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(product._id));

    const bag = JSON.parse(localStorage.getItem('bag') || '[]');
    setIsBag(bag.includes(product._id));
  }, [product._id]);

  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="p-[2px] text-base  border border-gray-950 rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.5)] duration-300 bg-transparent"
    >
      <div className="shadow-sm p-2 rounded-md min-w-[260px] max-w-[264px] min-h-[100px] max-h-[450px] bg-[#f5f5f5] bg-clip-padding">
        <div className="ml-1 min-h-[200px]">
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute transition-all duration-300 ease-in-out"
              >
                <div className="absolute top-0 rounded-full left-[200px] ease-in-out duration-300">
                  <IconButton onClick={toggleFavorite} color="error">
                    {isFavorite ? (
                      <FavoriteOutlinedIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </IconButton>
                </div>
                {(userData?.role === 'admin' ||
                  userData?._id === product.user?._id) && (
                  <div className="absolute top-0 left-[160px] ease-in-out duration-300">
                    <IconButton
                      className=""
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      <X />
                    </IconButton>
                  </div>
                )}

                {userData?.role === 'admin' && (
                  <Link
                    className="absolute left-30 ease-in-out duration-300"
                    to={`/edit/${product._id}`}
                  >
                    <div>
                      <IconButton color="inherit">
                        <Pencil />
                      </IconButton>
                    </div>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center items-center">
            <Link
              to={`/product/${product._id}`}
              className="min-w-[100px] min-h-[100px] bg-cover bg-center rounded-md mb-2"
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundSize: 'cover',
                minWidth: '250px',
                minHeight: '250px',
                maxWidth: '350px',
                maxHeight: '350px',
              }}
            />
          </div>
          <hr className="border-[#535151]" />
          <Link
            to={`/product/${product._id}`}
            className="flex justify-between pt-2"
          >
            <div>
              <div className="font-bold flex gap-2">
                <h1 className={` ${product.saveAmount && 'text-[#ff3535]'}`}>
                  {product.price}$
                </h1>
                {product.saveAmount &&
                  product.saveAmount !== null &&
                  product.saveAmount !== 0 && (
                    <div className="text-xs flex gap-1 items-center">
                      <h1 className="bg-[#3C8737] flex text-white rounded-md p-1">
                        save {product.saveAmount}
                        <h1
                          className=""
                          style={{ fontSize: '12px', lineHeight: '16px' }}
                        >
                          $
                        </h1>
                      </h1>
                    </div>
                  )}
              </div>
              <div className="w-auto">
                <div className="text-base">{product.name}</div>
              </div>
              <div className="">
                <div className="">
                  <div className="text-sm flex text-black/50 gap-1 ">
                    <Eye className="w-5 h-5 " />
                    {product.viewsCount} views
                  </div>
                </div>
                <div className="">
                  <div className="text-sm flex text-black/50 gap-1 ">
                    <BiSolidMessageSquare className="w-4 h-4" />
                    {product.commentsCount} reviews
                  </div>
                </div>
              </div>
            </div>
          </Link>
          {!Rejected && !Pending ? (
            <div className="mt-1 justify-center flex">
              <motion.button
                onClick={toggleBag}
                className={`w-[240px] cursor-pointer flex justify-center gap-1 rounded-xl p-1 text-base text-white  ${isBag ? 'bg-[#873737] active:bg-gradient-to-r active:from-[#873737] active:via-transparent active:to-[#3C8737]' : 'bg-[#3C8737] active:bg-gradient-to-r active:from-[#3C8737] active:via-transparent active:to-[#873737] '} transition-colors duration-200 ease- delay-50`}
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
                    initial={{ x: 80 }}
                    animate={{ x: 55 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                      delay: 0,
                    }}
                  >
                    <IoBag style={{ marginTop: '5px' }} />
                  </motion.div>
                ) : (
                  <motion.div
                    className="absolute"
                    initial={{ x: 55 }}
                    animate={{ x: 80 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,

                      delay: 0,
                    }}
                  >
                    <X size={20} className="mt-[3px]" />
                  </motion.div>
                )}
              </motion.button>
            </div>
          ) : (
            <div className="flex justify-between mt-2">
              <button
                className="bg-[#3C8737] text-white w-[120px] rounded-lg py-1 px-4 hover:bg-[#33722e] delay-50 transition-colors ease-linear duration-150"
                onClick={onSubmit}
              >
                Approve
              </button>
              <button
                className="  bg-[#932525] text-white w-[120px] rounded-lg py-1 px-4 hover:bg-[#7e2525] delay-50 transition-colors ease-linear duration-150"
                onClick={() => handleDelete(product._id)}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
