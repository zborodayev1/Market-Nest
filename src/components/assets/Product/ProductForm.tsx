import { Product } from '../../redux/slices/products'
import { Link } from 'react-router-dom'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CommentIcon from '@mui/icons-material/Comment'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import IconButton from '@mui/material/IconButton'
import { useEffect, useState } from 'react'
import { IoBag } from 'react-icons/io5'

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

  return (
    <div className="border shadow-lg shadow-[#84848466] p-2 rounded-md min-w-[250px] max-w-[420px] min-h-[100px] max-h-[600px]">
      <div className="ml-1 min-h-[300px]">
        <IconButton
          onClick={toggleFavorite}
          className="absolute left-[180px]"
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
            className="min-w-[100px] min-h-[100px]  bg-cover bg-center rounded-md "
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
        <hr />
        <div className="flex pt-2">
          <div>
            <div className="flex">
              <h1 className="font-bold text-xl">{product.price}$</h1>
            </div>
            <div className="w-auto">
              <Link
                to={`/product/${product._id}`}
                className="hover:text-[#0658F5] duration-100 text-lg"
              >
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
              <EyeIcon />
              <h1 className="font-bold">{product.viewsCount}</h1>
              <div className="flex ml-2">
                <CommentIcon />
                <h1 className="font-bold">{product.commentsCount}</h1>
              </div>
            </div>
            <div className="mt-2">
              <button className="bg-[#13483a] p-1 flex justify-center items-center w-[226px] bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300">
                <a className="mr-1">Add to</a>
                <IoBag />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
