import { Link } from 'react-router-dom'
import { selectIsAuth, selectUserProfile } from '../../redux/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { ProdileHeader } from '../Profile/ProfileComponent/ProfileHeaderComponents/ProfileHeader'
import { SideBar } from '../Profile/ProfileComponent/ProfileSideBar/SideBar'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Heart,
  IdCard,
  PackagePlus,
  PackageSearch,
  Bell,
  ShoppingCart,
} from 'lucide-react'
import { getProductsBySearch, fetchProducts } from '../../redux/slices/products'
import { AppDispatch, RootState } from '../../redux/store'
import { NotiHeaderDropDown } from '../Notification/NotiHeaderDropDown'

interface Props {
  toastRef?: React.RefObject<HTMLDivElement>
}

export const Header = (props: Props) => {
  const { toastRef } = props
  const isAuth = useSelector(selectIsAuth)
  const unreadNotiCount = useSelector(
    (state: RootState) => state.notifications.unread
  )
  const [open, setOpen] = useState(false)
  const [notiOpen, setNotiOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const notificationRef = useRef<HTMLDivElement | null>(null)
  const [unreadCount, setUnreadCount] = useState<number | null>(
    unreadNotiCount.count
  )
  const [searchITem, setSearchITem] = useState('')
  const userData = useSelector(selectUserProfile)
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(toastRef?.current && toastRef.current.contains(event.target as Node))
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [toastRef])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        notificationRef.current &&
        !notificationRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setNotiOpen(false)
      }
    }

    if (notiOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notiOpen])

  const socket = useMemo(() => new WebSocket('ws://195.210.47.125:3000'), []) //localhost:3000

  useEffect(() => {
    socket.onopen = () => {
      console.log('WebSocket подключен')

      socket.send(JSON.stringify({ type: 'auth', userId: userData?._id }))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (
        data.type === 'notificationUpdate' &&
        data.profileId === userData?._id &&
        data.increment !== 0
      ) {
        setUnreadCount((unreadCount) => (unreadCount += data.increment))
      } else if (data.increment === 0) {
        setUnreadCount(null)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      console.log('WebSocket соединение закрыто')
    }
  }, [socket, userData, unreadCount])

  const sidebarVariants = {
    initial: {
      x: 250,
      opacity: 0,
    },
    animate: {
      x: open ? 0 : 250,
      y: -3,
      opacity: open ? 1 : 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: 0.05,
      },
    },
    exit: {
      x: 250,
      y: -3,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: 0.05,
      },
    },
  }

  const handleSearch = async () => {
    if (searchITem.trim() === '') {
      dispatch(fetchProducts({ limit: 20, page: 1 }))
    } else {
      dispatch(getProductsBySearch(searchITem))
    }
  }

  return (
    <div>
      <div className="">
        <div className="relative items-center flex bg-[#F5F5F5] z-30 w-full h-[100px]">
          <div className="absolute left-[120px] transform -translate-x-1/2 flex justify-center items-center z-10">
            <motion.div className="flex justify-center py-4 px-4 w-full cursor-pointer ">
              <div className="hover:bg-[#e4e4e4] transition-colors duration-300 rounded-[15px] ease-in-out flex items-center p-2 px-3 ml-[50px]">
                <input
                  type="text"
                  onChange={(e) => setSearchITem(e.target.value)}
                  value={searchITem}
                  placeholder="Search"
                  className=" w-full px-4 py-2 bg-[#fff] border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:border-transparent transition-all duration-200"
                />
                <button
                  className="items-center absolute z-20 right-[35px]"
                  onClick={handleSearch}
                >
                  <PackageSearch
                    style={{ strokeWidth: 1.8 }}
                    className="w-7 h-7 ml-2 text-[#212121]"
                  />
                </button>
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-x-0 flex justify-center items-center">
            <Link to="/">
              <div className="flex justify-center group">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.5 },
                  }}
                  className="text-3xl font-bold text-[#212121]"
                >
                  Market Nest
                </motion.span>
              </div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5 },
            }}
            className="absolute right-3 flex items-center"
          >
            {isAuth ? (
              <div>
                <div className="flex">
                  <button
                    ref={buttonRef}
                    className="relative z-10 mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-3 rounded-full duration-500 ease-in-out group"
                    onClick={() => setNotiOpen(!notiOpen)}
                  >
                    <Bell className="w-8 h-8 stroke-2 text-[#212121]" />
                    {unreadCount != null && unreadCount > 0 && (
                      <span className="absolute -top-[2px] -right-[2px] bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <NotiHeaderDropDown
                    notiOpen={notiOpen}
                    notificationRef={notificationRef}
                    PropsForNoti={() => setNotiOpen}
                  />
                  <Link
                    className="mx-1 ml-3 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                    to="/create-product"
                  >
                    <h1 className="text-md font-bold text-[#212121]">Create</h1>
                    <PackagePlus className="w-9 h-9 text-[#212121]" />
                  </Link>
                  <Link
                    className="mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                    to="/bag"
                  >
                    <h1 className="text-md font-bold text-[#212121]">Bag</h1>
                    <ShoppingCart
                      style={{ strokeWidth: 1.8 }}
                      className="w-8 h-8 text-[#212121] stroke-1 "
                    />
                  </Link>
                  <Link
                    className="mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                    to="/favorites"
                  >
                    <h1 className="text-md font-bold text-[#212121]">
                      Favorite
                    </h1>
                    <Heart
                      className="w-7 h-9 text-[#212121]"
                      style={{ strokeWidth: 2.5 }}
                    />
                  </Link>
                  <div>
                    <ProdileHeader onSuccess={() => setOpen(!open)} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex">
                <Link
                  className="mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                  to="/bag"
                >
                  <h1 className="text-md font-bold text-[#212121]">Bag</h1>
                  <ShoppingCart
                    style={{ strokeWidth: 1.8 }}
                    className="w-8 h-8 text-[#212121] "
                  />
                </Link>
                <Link
                  className="mx-2 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                  to="/favorites"
                >
                  <h1 className="text-md font-bold text-[#212121]">Favorite</h1>
                  <Heart className="w-7 h-9 text-[#212121]" />
                </Link>
                <Link
                  to="/signIn"
                  className="mx-2 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-3 rounded-full duration-300 ease-in-out group mt-1"
                >
                  <h1 className="text-md font-bold text-[#212121] transition-colors duration-300">
                    Sign in
                  </h1>
                  <IdCard
                    style={{ strokeWidth: 1.8 }}
                    className="w-[44px] h-9 text-[#212121] transition-colors duration-300"
                  />
                </Link>
              </div>
            )}

            <div ref={dropdownRef} className="fixed right-0 top-0">
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={sidebarVariants}
                  >
                    <SideBar setOpen={setOpen} open={open} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <hr className="h-[2px] shadow-xl" />
      </div>
    </div>
  )
}
