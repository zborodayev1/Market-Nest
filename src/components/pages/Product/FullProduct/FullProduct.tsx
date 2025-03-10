import { CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IoBag } from 'react-icons/io5'
import { IconButton } from '@mui/material'
import { Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { BiSolidMessageSquare } from 'react-icons/bi'
import { CiCalendarDate } from 'react-icons/ci'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import {
  getOneProduct,
  selectFullProduct,
} from '../../../redux/slices/products'
import { Helmet } from 'react-helmet-async'
import { AppDispatch } from '../../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { SellerInfo } from './Seller/SellerInfo'
import {
  Delivery,
  getDelivery,
  selectDeliveries,
} from '../../../redux/slices/delivery'
import { DeliveryForm } from './DeliveryForm'

interface Props {
  noti?: boolean
}

export const FullProduct = (props: Props) => {
  const { noti } = props
  const data = useSelector(selectFullProduct)
  const delivery = useSelector(selectDeliveries)
  const { id } = useParams()
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isBag, setIsBag] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()

  const toggleFavorite = () => {
    if (!data) return
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== data._id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      favorites.push(data._id)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }

    setIsFavorite(!isFavorite)
  }

  useEffect(() => {
    if (id) {
      dispatch(getOneProduct(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    dispatch(getDelivery())
  }, [dispatch])

  const toggleBag = () => {
    if (!data) return
    const bag = JSON.parse(localStorage.getItem('bag') || '[]')

    if (isBag) {
      const newBag = bag.filter((id: string) => id !== data._id)
      localStorage.setItem('bag', JSON.stringify(newBag))
    } else {
      bag.push(data._id)
      localStorage.setItem('bag', JSON.stringify(bag))
    }

    setIsBag(!isBag)
  }

  useEffect(() => {
    if (data) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorite(favorites.includes(data._id))

      const bag = JSON.parse(localStorage.getItem('bag') || '[]')
      setIsBag(bag.includes(data._id))
    }
  }, [data])

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
    )
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
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0 }}
        className="ml-[200px] mt-5"
      >
        <div className="flex">
          <div className="text-2xl flex flex-col text-start">
            <div className="font-bold flex gap-2">
              <h1 className={`text-3xl ${data.saveAmount && 'text-[#ff3535]'}`}>
                {data.price}$
              </h1>
              {data.saveAmount && (
                <div className="text-xl flex gap-2 items-center">
                  <h1 className="bg-[#3C8737] text-white px-3 rounded-md p-1">
                    save {data.saveAmount}$
                  </h1>
                  <h1 className="text-gray-400 text-sm">
                    was {data.oldPrice}$
                  </h1>
                </div>
              )}
            </div>
            <div className=" ml-2">
              <div className="flex justify-between items-center gap-1">
                <h1 className="mr-2">{data.name}</h1>
                {noti && (
                  <div className="relative right-[50px]">
                    {data.status === 'approved' ? (
                      <h1 className="text-[#3C8737] font-bold">Approved</h1>
                    ) : data.status === 'rejected' ? (
                      <h1 className="text-red-600 font-bold">Rejected</h1>
                    ) : (
                      <h1 className="text-blue-600 font-bold">Pending</h1>
                    )}
                  </div>
                )}
              </div>
              <div className="flex text-[#a7a7a7]  items-center text-sm gap-2 mt-1 mb-5">
                <div className="flex gap-1">
                  {data.viewsCount} <Eye className="w-5 h-5 " />
                </div>
                <div className="flex gap-1">
                  {data.commentsCount}{' '}
                  <BiSolidMessageSquare className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  {data.createdAt} <CiCalendarDate className="w-5 h-5 " />
                </div>
                <div className="flex gap-1">
                  {data.tags && (
                    <h1 className="text-base text-[#a7a7a7]">
                      {data.tags.join(', ')}
                    </h1>
                  )}
                </div>
              </div>
            </div>
            <div className="group grid">
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
              <div className="my-5 group bg-[#f5f5f5] border-gray-500 border max-w-[500px] min-w-[400px] rounded-md p-5">
                <div>
                  <h1 className="text-2xl font-bold">Seller info</h1>
                </div>
                <div>
                  <SellerInfo user={data.user} />
                </div>
              </div>
            </div>
          </div>
          <div className="ml-10">
            <div className="border mt-10 border-[#6B7280] p-3 rounded-md">
              <div className="flex items-center gap-2">
                <svg width={40} height={40} viewBox="0 0 40 40">
                  <g fillRule="evenodd">
                    <path d="M36 27h-2.557c-.693-1.189-1.968-2-3.443-2s-2.75.811-3.443 2H25V14h6.485L36 20.32V27zm-6 4c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm-17 0c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm24.813-11.581l-5-7A.997.997 0 0032 12h-7V7a1 1 0 00-1-1H5a1 1 0 00-1 1v2.728a1 1 0 002 0V8h17v19h-6.556c-.694-1.189-1.97-2-3.444-2s-2.75.811-3.444 2H6v-3a1 1 0 10-2 0v4a1 1 0 001 1h4c0 2.206 1.794 4 4 4s4-1.794 4-4h9c0 2.206 1.794 4 4 4s4-1.794 4-4h3a1 1 0 001-1v-8a.994.994 0 00-.187-.581z"></path>
                    <path d="M3 14h7a1 1 0 000-2H3a1 1 0 000 2m8 7a1 1 0 00-1-1H3a1 1 0 100 2h7a1 1 0 001-1m-7-4a1 1 0 001 1h7a1 1 0 000-2H5a1 1 0 00-1 1"></path>
                  </g>
                </svg>

                <h1 className="text-xl font-bold ">Delivery</h1>
              </div>
              <div className="ml-3 mt-2 border-[#e4e4e4] border p-3 rounded-lg gap-1">
                {delivery &&
                  delivery.map((delivery: Delivery) => (
                    <DeliveryForm Delivery={delivery} />
                  ))}
              </div>
            </div>
            <div className="flex mt-5">
              <div>
                <button
                  onClick={toggleBag}
                  className="font-bold flex gap-2 w-[450px] bg-[#3C8737] rounded-xl py-3 text-white text-lg hover:bg-[#2b6128] transition-colors duration-150 ease-in-out justify-center"
                >
                  <motion.span
                    key={isBag ? 'add' : 'remove'}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                    }}
                  >
                    {isBag ? 'Remove from bag' : 'Add to bag'}
                  </motion.span>

                  <motion.div
                    className="absolute ml-1"
                    initial={{ x: 70 }}
                    animate={{ x: isBag ? 90 : 60 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                      delay: 0,
                    }}
                  >
                    <IoBag style={{ marginTop: '5px' }} />
                  </motion.div>
                </button>
              </div>
              <div className="ml-1">
                <IconButton
                  onClick={toggleFavorite}
                  className="flex w-[50px] h-[50px] text-2xl text-[#fd3939] transition-opacity duration-300 ease-in-out 
                "
                  color="error"
                >
                  {isFavorite ? (
                    <FavoriteOutlinedIcon style={{ width: 28, height: 28 }} />
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
      </motion.div>
    </>
  )
}
