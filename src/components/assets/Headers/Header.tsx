import { Link } from 'react-router-dom'
import { selectIsAuth } from '../../redux/slices/auth'
import { useSelector } from 'react-redux'
import SearchIcon from '@mui/icons-material/Search'
import { IoBagOutline } from 'react-icons/io5'
import { GoPlusCircle } from 'react-icons/go'
import { ProdileHeader } from '../../pages/Profile/SideBar/ProfileHeader'
import { SideBar } from '../../pages/Profile/SideBar/SideBar'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

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

  const [isHovered, setIsHovered] = useState(false)

  return (
    <div>
      <div className="">
        <div className="relative items-center  flex bg-[#16151A] z-30 w-screen h-[100px]">
          <div className="absolute ml-10 flex items-center">
            <SearchIcon
              style={{
                color: '#7e2dff',
              }}
            />
          </div>
          <div className="absolute inset-x-0 flex justify-center items-center">
            <Link to="/">
              <div className="flex justify-center h-[45px]">
                <motion.span className="hover:from-[#7e2dff]/80 hover:to-[#0004ff]/80 text-3xl font-bold bg-gradient-to-r from-[#7e2dff] to-[#0004ff] bg-clip-text text-transparent duration-300 transition-colors ease-in-out ">
                  Market Nest
                </motion.span>
              </div>
            </Link>
          </div>

          <div className="absolute right-3 flex items-center">
            {isAuth ? (
              <div>
                <div className="flex">
                  <Link
                    to="/cart"
                    className="mx-2 flex flex-col items-center hover:-translate-y-1 duration-300 ease-in-out group"
                  >
                    <div>
                      <IoBagOutline className="w-10 h-10 text-[#7e2dff] group-hover:text-[#7e2dff]/80 transition-colors duration-200" />
                    </div>

                    <h1
                      className="text-sm text-[#7e2dff] group-hover:text-[#7e2dff]/75 transition-colors duration-200 "
                      style={{
                        textShadow:
                          '2px 2px 6px #7e2dff, -2px -2px 6px #7e2dff',
                      }}
                    >
                      Bag
                    </h1>
                  </Link>
                  <Link
                    to="/create-product"
                    className="mx-2 flex flex-col items-center hover:-translate-y-1 duration-300 ease-in-out group"
                  >
                    <GoPlusCircle
                      style={{
                        justifyContent: 'center',
                      }}
                      className="w-10 h-10 text-[#7e2dff] group-hover:text-[#7e2dff]/80 transition-colors duration-200"
                    />
                    <h1
                      className="text-sm text-[#7e2dff] group-hover:text-[#7e2dff]/75"
                      style={{
                        textShadow:
                          '2px 2px 6px #7e2dff, -2px -2px 6px #7e2dff',
                      }}
                    >
                      Add product
                    </h1>
                  </Link>
                  <div className="">
                    <ProdileHeader onSuccess={() => setOpen(!open)} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex">
                <Link to="/signIn" className="mx-3">
                  <motion.button
                    initial={{ borderRadius: 10 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ scale: 1.02, borderRadius: 12 }}
                    whileTap={{ scale: 0.99 }}
                    className={` w-28 p-2 flex rounded-md justify-center items-center  border border-[#7e2dff] hover:-translate-y-1 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#7e2dff] hover:to-[#2124a8] hover:border-transparent group `}
                  >
                    <span
                      style={{
                        textShadow: isHovered
                          ? '2px 2px 6px #fff, -2px -2px 6px #fff'
                          : '',
                      }}
                      className="  text-[#7e2dff]  duration-300 transition-colors ease-in-out group-hover:text-white  "
                    >
                      Sign In
                    </span>
                  </motion.button>
                </Link>
              </div>
            )}
            <div ref={dropdownRef} className="fixed right-1 top-1">
              {open && <SideBar setOpen={setOpen} open={open} />}
            </div>
          </div>
        </div>
        <hr className="h-[2px] bg-gradient-to-r from-[#7e2dff] to-[#0004ff] border-0" />
      </div>
    </div>
  )
}
