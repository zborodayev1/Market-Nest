import { CircularProgress } from '@mui/material'
import axios from '../../../../axios'
import { useState, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { IoBag } from 'react-icons/io5'
import { IconButton } from '@mui/material'
import { Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { BiSolidMessageSquare } from 'react-icons/bi'
import { CiCalendarDate } from 'react-icons/ci'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { Product } from '../../../redux/slices/products'
import { Helmet } from 'react-helmet-async'
import { AppDispatch } from '../../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, UserProfile } from '../../../redux/slices/auth'
import { SellerInfo } from './Seller/SellerInfo'

interface Props {
  noti?: boolean
}

export const FullProduct = (props: Props) => {
  const { noti } = props
  const [data, setData] = useState<Product>()
  const [err, setErr] = useState(false)
  const { id } = useParams()
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isBag, setIsBag] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()
  const productUser = useSelector(
    (state: { auth: { productUser: UserProfile | null } }) =>
      state.auth.productUser
  )

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
    const fetchData = async () => {
      try {
        const response = await axios.get(`/products/${id}`)

        setData(response.data)
      } catch (err) {
        console.warn('Error fetching product:', err)
        setErr(true)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    if (data?.user) {
      dispatch(getUserProfile(data.user))
    }
  }, [data?.user, dispatch])

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

  if (err) {
    return <Navigate to="/" />
  }

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
        className=" ml-[140px] mt-5"
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
                  <h1 className="text-lg pb-3 text-[#fd3939]">
                    -{data.discount}%
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
              <div className="flex text-[#a7a7a7] items-center text-sm gap-2 mt-1 mb-5">
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
                <div className="flex gap-1 absolute ml-[185px]">
                  {data.tags && (
                    <h1 className="text-base text-[#a7a7a7]">
                      {data.tags.join(', ')}
                    </h1>
                  )}
                </div>
              </div>
            </div>
            <div className="group flex">
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

              <IconButton
                onClick={toggleFavorite}
                className={`flex w-10 h-10  text-2xl text-[#fd3939] transition-opacity duration-300 ease-in-out 
                }`}
                color="error"
              >
                {isFavorite ? (
                  <FavoriteOutlinedIcon />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
              </IconButton>
            </div>
          </div>
          <div className="flex ml-10 items-end">
            <div className="">
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
                  className="absolute"
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
          </div>
        </div>
      </motion.div>
      <div className="mt-10 ml-[140px] group bg-[#f5f5f5] border-gray-500 border max-w-[500px] min-w-[300px] rounded-md p-3">
        <div>
          <h1 className="text-2xl font-bold">Seller info</h1>
        </div>
        <div>
          <SellerInfo user={productUser} />
        </div>
      </div>
    </>
  )
}
