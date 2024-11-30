import { Link } from 'react-router-dom'
import { selectIsAuth } from '../../redux/slices/auth'
import { useSelector } from 'react-redux'
import { ProdileHeader } from '../../pages/Profile/SideBar/ProfileHeader'
import { SideBar } from '../../pages/Profile/SideBar/SideBar'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, IdCard } from 'lucide-react'
import { IoBagOutline } from 'react-icons/io5'

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
  return (
    <div>
      <div className="">
        <div className="relative items-center  flex bg-[#F5F5F5] z-30 w-screen h-[100px]">
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
                  <div className="mr-[14px]">
                    <ProdileHeader onSuccess={() => setOpen(!open)} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex">
                <Link
                  className="mx-2 flex gap-2 items-center hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1"
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

            <div ref={dropdownRef} className="fixed right-0 top-1">
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
