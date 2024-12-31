import { deleteProduct, Product } from '../../redux/slices/products'
import { Link } from 'react-router-dom'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import { Eye, X, Pencil } from 'lucide-react'
import { BiSolidMessageSquare } from 'react-icons/bi'
import { IoBag } from 'react-icons/io5'
import { AnimatePresence, motion } from 'motion/react'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'

interface ProductFormProps {
  product: Product
  onRemoveFavorite?: (id: string) => void
  onRemoveBag?: (id: string) => void
  Edit?: boolean
  Pending?: boolean
  Rejected?: boolean
  onSubmit?: () => void
}

interface DecodedToken {
  role: string
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onRemoveFavorite,
  onRemoveBag,
  Pending,
  Rejected,
  Edit,
  onSubmit,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()

  const [isBag, setIsBag] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        if (decoded.role === 'admin') {
          setIsAdmin(true)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error('Failed to decode token')
      }
    }
  }, [])

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

  const handleDelete = async (productId: string) => {
    dispatch(deleteProduct(productId))
  }

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(product._id))

    const bag = JSON.parse(localStorage.getItem('bag') || '[]')
    setIsBag(bag.includes(product._id))
  }, [product._id])

  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="p-[2px] text-base shadow-xl border border-gray-950 rounded-lg hover:-translate-y-1 duration-300 bg-transparent"
    >
      <div className="shadow-sm p-2 rounded-md min-w-[260px] max-w-[264px] min-h-[100px] max-h-[450px] bg-[#f5f5f5] bg-clip-padding">
        <div className="ml-1 min-h-[200px]">
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute  transition-all  duration-300 ease-in-out"
              >
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

                {isAdmin && (
                  <IconButton
                    className="absolute top-0 left-[120px] ease-in-out duration-300"
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    <X />
                  </IconButton>
                )}
                {Edit ||
                  (isAdmin && (
                    <Link to={`/edit/${product._id}`}>
                      <IconButton
                        className="absolute top-0 left-[-80px] ease-in-out duration-300"
                        color="primary"
                      >
                        <Pencil />
                      </IconButton>
                    </Link>
                  ))}
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
                {product.discount != 0 && product.saveAmount != 0 && (
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
          {!Rejected && !Pending ? (
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
          ) : (
            <div className="flex justify-between mt-2">
              <button
                className="bg-[#3C8737] text-white w-[120px] rounded-lg py-1 px-4 hover:-translate-y-1 transition-transform ease-in-out duration-300"
                onClick={onSubmit}
              >
                Approve
              </button>
              <button
                className="  bg-[#932525] text-white w-[120px] rounded-lg py-1 px-4 hover:-translate-y-1 transition-transform ease-in-out duration-300"
                onClick={() => handleDelete(product._id)}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
