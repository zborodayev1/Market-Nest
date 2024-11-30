import { Product } from '../../redux/slices/products'
import { Link } from 'react-router-dom'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import { Eye } from 'lucide-react'
import { BiCommentDetail } from 'react-icons/bi'
import { CiCalendarDate } from 'react-icons/ci'

interface ProductFormProps {
  product: Product
}

export const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(product._id))
  }, [product._id])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== product._id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      favorites.push(product._id)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }

    setIsFavorite(!isFavorite)
  }

  return (
    <div className="p-[2px] shadow-xl border border-gray-950 rounded-lg hover:-translate-y-1 duration-300 bg-transparent">
      <div className="shadow-sm p-2 rounded-md min-w-[250px] max-w-[520px] min-h-[100px] max-h-[600px] bg-[#f5f5f5] bg-clip-padding">
        <div className="ml-1 min-h-[200px]">
          <div className="relative  transition-all  duration-300 ease-in-out">
            <IconButton
              onClick={toggleFavorite}
              className="absolute top-0 left-[190px] ease-in-out duration-300"
              color="error"
            >
              {isFavorite ? (
                <FavoriteOutlinedIcon />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
            </IconButton>
          </div>

          <div className="flex justify-center items-center">
            <Link
              to={`/product/${product._id}`}
              className="min-w-[100px] min-h-[100px] bg-cover bg-center rounded-md "
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundSize: 'cover',
                minWidth: '150px',
                minHeight: '150px',
                maxWidth: '250px',
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
              <div className="flex">
                <h1 className="font-bold text-xl ">{product.price}$</h1>
              </div>
              <div className="w-auto">
                <Link to={`/product/${product._id}`} className="text-lg">
                  {product.name}
                </Link>
              </div>
            </div>
            <div className="">
              <div className="">
                <Link
                  to={`/product/${product._id}`}
                  className="text-sm flex text-black/50 gap-1 justify-end"
                >
                  {product.viewsCount} <Eye className="w-5 h-5 " />
                </Link>
              </div>
              <div className="">
                <Link
                  to={`/product/${product._id}`}
                  className="text-sm flex text-black/50 gap-1 justify-end"
                >
                  {product.commentsCount}{' '}
                  <BiCommentDetail className="w-5 h-5" />
                </Link>
              </div>
              <div className=" opacity-100 z-10">
                <Link
                  to={`/product/${product._id}`}
                  className="text-sm flex text-black/50 gap-1"
                >
                  {product.createdAt} <CiCalendarDate className="w-5 h-5 " />
                </Link>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
