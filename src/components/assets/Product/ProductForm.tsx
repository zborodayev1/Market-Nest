import { Product } from '../../redux/slices/products'
import { Link } from 'react-router-dom'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CommentIcon from '@mui/icons-material/Comment'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { useEffect, useState } from 'react'
import { IoBag } from 'react-icons/io5'
import { IconButton } from '@mui/material'
import { motion } from 'motion/react'

interface ProductFormProps {
  product: Product
  isFull?: boolean
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isFull,
}) => {
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

  const [isHovered, setIsHovered] = useState(false)

  // const handleAddToBag = () => {

  // }

  return (
    <div className="p-[2px] bg-gradient-to-r from-[#5b3c8c] to-[#0f118a] bg-clip-border border-2 border-transparent rounded-lg hover:-translate-y-1 duration-300 bg-transparent">
      <div className="shadow-sm p-2 rounded-md min-w-[250px] max-w-[420px] min-h-[100px] max-h-[600px] bg-[#19181e] bg-clip-padding">
        <div className="ml-1 min-h-[300px]">
          <IconButton
            onClick={toggleFavorite}
            className="absolute top-0 left-[190px]"
            color="error"
          >
            {isFavorite ? (
              <FavoriteOutlinedIcon />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
          </IconButton>

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
                maxHeight: '250px',
              }}
            />
          </div>
          <hr className="border-[#535151]" />
          <div className="flex pt-2 ">
            <div>
              <div className="flex">
                <h1 className="font-bold text-xl ">{product.price}$</h1>
              </div>
              <div className="w-auto">
                <Link to={`/product/${product._id}`} className="text-xl">
                  {product.name}
                </Link>
              </div>
              <div>
                {isFull ? (
                  product.description ? (
                    <div>Description: {product.description}</div>
                  ) : (
                    <div>No description</div>
                  )
                ) : null}
              </div>
              <div className="text-[#687585] flex">
                <EyeIcon style={{}} />
                <h1 className="font-bold  ml-1">{product.viewsCount}</h1>
                <div className="flex ml-2">
                  <CommentIcon style={{}} />
                  <h1 className="font-bold  ml-1">{product.commentsCount}</h1>
                </div>
              </div>
              <div className="mt-2">
                <motion.button
                  initial={{ borderRadius: 5 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  whileHover={{ scale: 1.02, borderRadius: 7 }}
                  whileTap={{ scale: 0.99 }}
                  className={` w-[226px] p-2 flex justify-center items-center  border border-[#7e2dff] hover:-translate-y-1 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#7e2dff] hover:to-[#2124a8] hover:border-transparent group `}
                >
                  <span
                    style={{
                      textShadow: isHovered
                        ? '2px 2px 6px #fff, -2px -2px 6px #fff'
                        : '',
                    }}
                    className="  text-[#7e2dff]  duration-300 transition-colors ease-in-out group-hover:text-white  "
                  >
                    Add to
                  </span>
                  <IoBag
                    style={{
                      marginLeft: '5px',
                      color: isHovered ? '#fff' : '#7e2dff',
                      transition: 'color 300ms',
                    }}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
