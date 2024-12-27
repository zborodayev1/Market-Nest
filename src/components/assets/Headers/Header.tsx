import { Link } from 'react-router-dom'
import { selectIsAuth } from '../../redux/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { ProdileHeader } from '../Profile/ProfileComponent/ProfileHeaderComponents/ProfileHeader'
import { SideBar } from '../Profile/ProfileComponent/ProfileSideBar/SideBar'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, IdCard, PackagePlus, PackageSearch, Bell } from 'lucide-react'
import { IoBagOutline } from 'react-icons/io5'
import { getProductsBySearch, fetchProducts } from '../../redux/slices/products'
import { AppDispatch } from '../../redux/store'
import { Notifications } from '../../pages/Notification/Notifications'

export const Header = () => {
  const isAuth = useSelector(selectIsAuth)
  const [open, setOpen] = useState(false)
  const [notiOpen, setNotiOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const notificationRef = useRef<HTMLDivElement | null>(null)
  const [searchITem, setSearchITem] = useState('')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  const dispatch: AppDispatch = useDispatch()

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
        <div className="relative items-center flex bg-[#F5F5F5] z-30 w-screen h-[100px]">
          <div className="absolute left-[120px] transform -translate-x-1/2 flex justify-center items-center z-10">
            <motion.div className="flex justify-center py-4 px-4 w-full cursor-pointer ">
              <div className=" hover:bg-[#e4e4e4] transition-colors duration-300 rounded-[15px] ease-in-out flex items-center p-2 px-3  ml-[80px]">
                <input
                  type="text"
                  onChange={(e) => setSearchITem(e.target.value)}
                  value={searchITem}
                  placeholder="Search"
                  className="w-full px-4 py-2 bg-[#fff] border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:border-transparent transition-all duration-200"
                />
                <button
                  className="items-center absolute z-20 right-[35px]"
                  onClick={handleSearch}
                >
                  <PackageSearch className=" w-7 h-7 ml-2 text-[#212121]" />
                </button>
              </div>
            </motion.div>
          </div>

          <button
            ref={buttonRef}
            className={`ml-[320px] z-10 mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-500 ease-in-out group`}
            onClick={() => setNotiOpen(!notiOpen)}
          >
            <h1 className="text-md font-bold text-[#212121]">Notifications</h1>
            <Bell className="w-8 h-8 stroke-2 text-[#212121]" />
          </button>
          <div className="absolute top-[70px] left-[230px] ">
            <AnimatePresence>
              {notiOpen && (
                <motion.div
                  ref={notificationRef}
                  initial={{ opacity: 0, y: -40 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0, y: 40 }}
                  className="flex justify-center bg-[#fafafa] mt-3 border-slate-500 border-2 rounded-xl z-20 w-[350px] px-[50px] min-h-[340px] max-h-[1440px]"
                >
                  <Notifications onSuccess={() => setNotiOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
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
                  <Link
                    className="mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
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
                    <IoBagOutline className="w-9 h-9 text-[#212121]" />
                  </Link>
                  <Link
                    className="mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                    to="/favorites"
                  >
                    <h1 className="text-md font-bold text-[#212121]">
                      Favorite
                    </h1>
                    <Heart className="w-7 h-9 text-[#212121]" />
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
                  <IoBagOutline className="w-9 h-9 text-[#212121]" />
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
                  <IdCard className="w-12 h-9 text-[#212121] transition-colors duration-300" />
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
