import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
  Pending,
  Rejected,
  onRemoveFavorite,
  onSubmit,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

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

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(product._id));
  }, [product._id]);

  const handleDelete = async (productId: string) => {
    dispatch(deleteProduct(productId));
  };

  return (
    <div className="text-base  rounded-lg">
      <div className="rounded-md min-w-[260px] max-w-[280px] max-h-[500px]">
        <div className="ml-1 min-h-[200px]">
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden transition-shadow">
            <Link to={`/product/${product._id}`}>
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image || ''}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="w-80 bg-gray-200 h-[2px]" />
            <div className="p-4 pt-2 relative">
              <h1 className="text-gray-900 font-medium mb-1">{product.name}</h1>
              <div className="flex items-center justify-between">
                <span
                  className={` ${product.saveAmount ? 'text-[#ff3535]' : 'text-[#1f5e1c]'} flex gap-2 font-semibold`}
                >
                  ${product.price}
                  {product.saveAmount && product.saveAmount !== 0 && (
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
                </span>
              </div>

              <div className="absolute bottom-9 right-0">
                <IconButton onClick={toggleFavorite} color="error">
                  {isFavorite ? (
                    <FavoriteOutlinedIcon />
                  ) : (
                    <FavoriteBorderOutlinedIcon />
                  )}
                </IconButton>
              </div>
            </div>
          </div>

          {Rejected ||
            (Pending && (
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
            ))}
        </div>
      </div>
    </div>
  );
};
