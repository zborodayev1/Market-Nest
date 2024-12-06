import { Link } from 'react-router-dom'
import { selectIsAuth } from '../../redux/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { ProdileHeader } from '../../pages/Profile/SideBar/ProfileHeader'
import { SideBar } from '../../pages/Profile/SideBar/SideBar'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Heart,
  IdCard,
  PackagePlus,
  PackageSearch,
  PackageMinus,
} from 'lucide-react'
import { IoBagOutline } from 'react-icons/io5'
import { getProductsBySearch, fetchProducts } from '../../redux/slices/products'

export const Header = () => {
  const isAuth = useSelector(selectIsAuth)
  const [open, setOpen] = useState(false)

  const dropdownRef = useRef(null)

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

  const dispatch = useDispatch()
  const [search, setSearch] = useState(false)
  const [animation, setAnimation] = useState('')

  useEffect(() => {
    if (search) {
      setAnimation('search')
    } else {
      setAnimation('notSearch')
    }
  }, [search])

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value
    if (searchTerm.trim() === '') {
      dispatch(fetchProducts())
    } else {
      dispatch(getProductsBySearch(searchTerm))
    }
  }

  return (
    <div>
      <div className="">
        <div className="relative items-center  flex bg-[#F5F5F5] z-30 w-screen h-[100px]">
          <div className="absolute left-[120px] transform -translate-x-1/2 flex justify-center items-center z-10">
            <AnimatePresence mode="wait">
              {search ? (
                <motion.div
                  key="searchBar"
                  initial={{
                    opacity: 0,
                    x: -40,
                  }}
                  animate={{
                    opacity: 1,
                    x: 40,
                  }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center justify-center group py-4 px-4 w-full gap-2 "
                >
                  <div className="flex group-hover:bg-[#e4e4e4] p-[5px] rounded-xl transition-colors duration-300 ease-in-out">
                    <input
                      type="text"
                      onChange={handleSearch}
                      placeholder="Search"
                      className="w-full px-4 py-2 bg-[#fff] border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:border-transparent transition-all duration-200"
                    />
                    <button
                      className="flex items-center font-bold mx-1"
                      onClick={() => setSearch(false)}
                    >
                      Close
                      <PackageMinus className="ml-1 w-9 h-9 text-[#212121] transition-colors duration-200" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="searchButton"
                  initial={{
                    opacity: 0,
                    y: animation === 'notSearch' ? 20 : -20,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  onClick={() => setSearch(true)}
                  className="flex  justify-center py-4 px-4 w-full cursor-pointer "
                >
                  <div className="hover:bg-[#e4e4e4] transition-colors duration-300 rounded-full ease-in-out flex items-center p-2 px-3">
                    <h1 className="font-bold mr-2">Search</h1>
                    <PackageSearch className="w-9 h-9 text-[#212121] transition-colors duration-200" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute inset-x-0 flex justify-center items-center">
            <Link to="/">
              <div className="flex justify-center  group">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.5 },
                  }}
                  className=" text-3xl font-bold text-[#212121] "
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
                    to="/create"
                  >
                    <h1 className="text-md font-bold text-[#212121]  transition-colors duration-200 ">
                      Create
                    </h1>
                    <PackagePlus className="w-9 h-9 text-[#212121] transition-colors duration-200" />
                  </Link>
                  <Link
                    className="mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                    to="/bag"
                  >
                    <h1 className="text-md font-bold text-[#212121]  transition-colors duration-200 ">
                      Bag
                    </h1>
                    <IoBagOutline className="w-9 h-9 text-[#212121] transition-colors duration-200" />
                  </Link>
                  <Link
                    className="mx-1 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                    to="/favorites"
                  >
                    <h1 className="text-md font-bold text-[#212121]  transition-colors duration-200 ">
                      Favorite
                    </h1>
                    <Heart className="w-7 h-9 text-[#212121] transition-colors duration-200" />
                  </Link>
                  <div className="">
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
                  <h1 className="text-md font-bold text-[#212121]  transition-colors duration-200 ">
                    Bag
                  </h1>
                  <IoBagOutline className="w-9 h-9 text-[#212121] transition-colors duration-200" />
                </Link>
                <Link
                  className="mx-2 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
                  to="/favorites"
                >
                  <h1 className="text-md font-bold text-[#212121]  transition-colors duration-200 ">
                    Favorite
                  </h1>
                  <Heart className="w-7 h-9 text-[#212121] transition-colors duration-200" />
                </Link>
                <Link
                  to="/signIn"
                  className="mx-2 flex gap-2  items-center hover:bg-[#E4E4E4] p-2 px-3 rounded-full duration-300 ease-in-out group mt-1"
                >
                  <h1 className="text-md font-bold text-[#212121] transition-colors duration-300 ">
                    Sign in
                  </h1>
                  <IdCard className="w-12 h-9 text-[#212121]  transition-colors duration-300" />
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
