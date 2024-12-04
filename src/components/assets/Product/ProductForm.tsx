import { Product } from '../../redux/slices/products'
import { Link } from 'react-router-dom'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import { Eye } from 'lucide-react'
import { BiSolidMessageSquare } from 'react-icons/bi'
import { IoBag } from 'react-icons/io5'
import { motion } from 'motion/react'

interface ProductFormProps {
  product: Product
  onRemoveFavorite?: (id: string) => void
  onRemoveBag?: (id: string) => void
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onRemoveFavorite,
  onRemoveBag,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isBag, setIsBag] = useState<boolean>(false)

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== product._id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))

      if (onRemoveFavorite) onRemoveFavorite(product._id)
    } else {
      favorites.push(product._id)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }

    setIsFavorite(!isFavorite)
  }

  const toggleBag = () => {
    const bag = JSON.parse(localStorage.getItem('bag') || '[]')

    if (isBag) {
      const newBag = bag.filter((id: string) => id !== product._id)
      localStorage.setItem('bag', JSON.stringify(newBag))
      if (onRemoveBag) onRemoveBag(product._id)
    } else {
      bag.push(product._id)
      localStorage.setItem('bag', JSON.stringify(bag))
    }

    setIsBag(!isBag)
  }

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(product._id))

    const bag = JSON.parse(localStorage.getItem('bag') || '[]')
    setIsBag(bag.includes(product._id))
  }, [product._id])

  return (
    <div className="p-[2px] text-base shadow-xl border border-gray-950 rounded-lg hover:-translate-y-1 duration-300 bg-transparent">
      <div className="shadow-sm p-2 rounded-md min-w-[260px] max-w-[264px] min-h-[100px] max-h-[350px] bg-[#f5f5f5] bg-clip-padding">
        <div className="ml-1 min-h-[200px]">
          <div className="relative  transition-all  duration-300 ease-in-out">
            <IconButton
              onClick={toggleFavorite}
              className="absolute top-0 left-[200px] ease-in-out duration-300"
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
              <div className="font-bold flex gap-2">
                <h1 className={` ${product.saveAmount && 'text-[#ff3535]'}`}>
                  {product.price}$
                </h1>
                {product.discount != 0 && product.save != 0 && (
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
                    <h1 className="text-base text-[#D3312F]">
                      -{product.discount}%
                    </h1>
                  </div>
                )}
              </div>
              <div className="w-auto">
                <Link to={`/product/${product._id}`} className="text-base">
                  {product.name}
                </Link>
              </div>
              <div className="">
                <div className="">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-sm flex text-black/50 gap-1 "
                  >
                    <Eye className="w-5 h-5 " />
                    {product.viewsCount} views
                  </Link>
                </div>
                <div className="">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-sm flex text-black/50 gap-1 "
                  >
                    <BiSolidMessageSquare className="w-4 h-4" />
                    {product.commentsCount} reviews
                  </Link>
                </div>
              </div>
            </div>
          </Link>
          <div className="mt-1 justify-center flex">
            <motion.button
              onClick={toggleBag}
              className="w-[240px] flex gap-1 bg-[#3C8737] rounded-md py-1 text-white text-base hover:bg-[#2b6128] transition-colors duration-150 ease-in-out justify-center"
              style={{ overflow: 'hidden' }}
            >
              <motion.span
                key={isBag ? 'add' : 'remove'}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  delay: 0.2,
                }}
              >
                {isBag ? 'Remove from bag' : 'Add to bag'}
              </motion.span>

              <motion.div
                className="absolute"
                initial={{ x: 55 }}
                animate={{ x: isBag ? 80 : 55 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  delay: 0,
                }}
              >
                <IoBag style={{ marginTop: '5px' }} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
