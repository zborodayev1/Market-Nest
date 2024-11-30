import { AnimatePresence, motion } from 'framer-motion'
import { AppDispatch, persistor } from '../../../redux/store'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProfileData,
  logout,
  selectUserProfile,
  uploadImage,
} from '../../../redux/slices/auth'
import { ChevronDown, LogOut, LogIn, Heart } from 'lucide-react'
import CloseIcon from '@mui/icons-material/Close'
import { Avatar } from '@mui/material'
import { UserData } from './forms/UserData'
import { Email } from './forms/Email'
import { Password } from './forms/Password'
import { Link } from 'react-router-dom'
import { IoBagOutline } from 'react-icons/io5'
import { GoPlusCircle } from 'react-icons/go'

interface Props {
  setOpen: (value: boolean) => void
  open: boolean
}

export const SideBar = (props: Props) => {
  const [logOutState, setLogOutState] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const { setOpen, open } = props
  const userData = useSelector(selectUserProfile)
  const [file, setFile] = useState<File | null>(null)
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [change, setChange] = useState<boolean>(false)

  const [state, setState] = useState<{
    ChangeName: boolean
    ChangePassword: boolean
    ChangeAddress: boolean
    ChangeEmail: boolean
  }>({
    ChangeName: false,
    ChangePassword: false,
    ChangeAddress: false,
    ChangeEmail: false,
  })

  useEffect(() => {
    if (logOutState === true) {
      dispatch(logout())
      localStorage.removeItem('token')
      persistor.purge()
      setLogOutState(false)
    }
  }, [logOutState, dispatch])

  const onClickLogout = () => {
    setLogOutState(true)
    dispatch(logout())
    localStorage.removeItem('token')
    persistor.purge()
    setOpen(false)
  }

  const handleUpload = async () => {
    setChange(false)
    if (file) {
      const formData = new FormData()
      formData.append('image', file)

      const resultAction = await dispatch(uploadImage(formData))
      if (uploadImage.fulfilled.match(resultAction)) {
        dispatch(fetchProfileData())
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null)
    setChange(true)
  }

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    whileHover: {
      scale: 1.2,
      transition: { duration: 0.2 },
    },
  }

  const [isHovered, setIsHovered] = useState(false)
  return (
    <div>
      {open && (
        <div className="fixed top-0 right-0 bg-[#16151A] border-l-[2px] border-[#7e2dff]  shadow-md min-w-[400px] h-screen p-3 overflow-hidden hover:overflow-auto">
          <div className="fixed right-6 top-6">
            <motion.button
              className="hover:bg-[#272727] duration-300 w-[35px] h-[35px] rounded-lg"
              onClick={() => setOpen(false)}
            >
              <CloseIcon style={{ width: 20, height: 20 }} />
            </motion.button>
          </div>
          <motion.div variants={contentVariants}>
            <div className="flex flex-col gap-2 mt-[16px]">
              <motion.div
                variants={contentVariants}
                className="text-sm font-bold flex items-center gap-2"
              >
                <button
                  onClick={() => inputFileRef.current?.click()}
                  className="relative group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.div
                    initial={{
                      boxShadow: '4px -4px 10px #7e2dff, -4px 4px 10px #0004ff',
                    }}
                    animate={{
                      boxShadow: isHovered
                        ? '-4px 4px 10px #7e2dff, 4px -4px 10px #0004ff'
                        : '4px -4px 10px #7e2dff, -4px 4px 10px #0004ff',
                      filter: isHovered ? 'blur(2px)' : 'blur(0px)',
                      transition: { duration: 0.5 },
                    }}
                    exit={{
                      boxShadow: '4px -4px 10px #7e2dff, -4px 4px 10px #0004ff',
                    }}
                    className="rounded-full "
                  >
                    <Avatar
                      style={{ width: 45, height: 45 }}
                      src={userData?.avatarUrl}
                    />
                  </motion.div>

                  <div className="absolute inset-0 flex items-center justify-center rounded-full  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-xs font-medium">
                      Change Avatar
                    </span>
                  </div>
                </button>
                <input
                  ref={inputFileRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {change && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpload}
                    className="px-3 py-1 bg-blue-50 text-violet-600 border border-violet-600 rounded-md text-sm"
                  >
                    Change
                  </motion.button>
                )}

                <motion.button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      ChangeName: !prev.ChangeName,
                      ChangeEmail: false,
                      ChangePassword: false,
                    }))
                  }
                  className="hover:bg-[#272727] p-2 py-3 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <div className="bg-gradient-to-r from-[#7e2dff] to-[#0004ff] bg-clip-text text-transparent duration-300 transition-colors ease-in-out">
                    {userData?.fullName ? (
                      <span>{userData?.fullName}</span>
                    ) : (
                      <div>User Data:</div>
                    )}
                  </div>

                  <motion.div
                    animate={{ rotate: state.ChangeName ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown style={{ width: 17 }} />
                  </motion.div>
                </motion.button>
              </motion.div>

              <AnimatePresence mode="wait">
                {state.ChangeName && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeInOut',
                    }}
                  >
                    <UserData
                      onSuccess={() =>
                        setState((prev) => ({
                          ...prev,
                          ChangeName: !prev.ChangeName,
                        }))
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                variants={contentVariants}
                className="text-sm font-bold"
              >
                <motion.button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      ChangeEmail: !prev.ChangeEmail,
                      ChangeName: false,
                      ChangePassword: false,
                    }))
                  }
                  className="hover:bg-[#272727] p-2 py-3 rounded-lg flex items-center gap-1 w-full transition-colors"
                >
                  <div className="bg-gradient-to-r from-[#7e2dff] to-[#0004ff] bg-clip-text text-transparent duration-300 transition-colors ease-in-out">
                    {userData?.email ? (
                      <span>{userData.email}</span>
                    ) : (
                      <div>Email:</div>
                    )}
                  </div>

                  <motion.div
                    animate={{ rotate: state.ChangeEmail ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown style={{ width: 17 }} />
                  </motion.div>
                </motion.button>
              </motion.div>
              <AnimatePresence mode="wait">
                {state.ChangeEmail && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeInOut',
                    }}
                  >
                    <Email
                      onSuccess={() =>
                        setState((prev) => ({
                          ...prev,
                          ChangeEmail: !prev.ChangeEmail,
                        }))
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                variants={contentVariants}
                className="text-sm font-bold"
              >
                <motion.button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      ChangeEmail: false,
                      ChangeName: false,
                      ChangePassword: !prev.ChangePassword,
                    }))
                  }
                  className="hover:bg-[#272727] p-2 py-3 rounded-lg flex items-center gap-1 w-full transition-colors"
                >
                  <div className="bg-gradient-to-r from-[#7e2dff] to-[#0004ff] bg-clip-text text-transparent duration-300 transition-colors ease-in-out">
                    Change password
                  </div>

                  <motion.div
                    animate={{ rotate: state.ChangePassword ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown style={{ width: 17 }} />
                  </motion.div>
                </motion.button>
              </motion.div>
              <AnimatePresence mode="wait">
                {state.ChangePassword && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeInOut',
                    }}
                  >
                    <Password
                      onSuccess={() =>
                        setState((prev) => ({
                          ...prev,
                          ChangePassword: !prev.ChangePassword,
                        }))
                      }
                    />
                  </motion.div>
                )}
                <hr className="bg-gradient-to-r from-[#7e2dff] to-[#0004ff] h-[1px] border-0" />
                <Link
                  className="my-2 mx-2 flex gap-2 text-[#fb3c3c] group-hover:text-[#fb3c3c]/80 hover:-translate-y-1 duration-300 ease-in-out group"
                  to="/favorites"
                >
                  <Heart className="w-7 h-7 text-[#fb3c3c] group-hover:text-[#fb3c3c]/80 transition-colors duration-200" />
                  <h1 style={{ textShadow: '2px 2px 6px rgb(220, 38, 38)' }}>
                    Favorites
                  </h1>
                </Link>
                <Link
                  to="/bag"
                  className="my-2 mx-2 flex gap-2 text-[#7e2dff] group-hover:text-[#7e2dff]/80 hover:-translate-y-1 duration-300 ease-in-out group"
                >
                  <IoBagOutline className="w-7 h-7 text-[#7e2dff] group-hover:text-[#7e2dff]/80 transition-colors duration-200" />

                  <h1 style={{ textShadow: '2px 2px 6px #7e2dff' }}>Bag</h1>
                </Link>
                <Link
                  to="/create-product"
                  className="my-2 mx-2  flex text-[#0004ff] gap-2 group-hover:text-[#0004ff]/80 hover:-translate-y-1 duration-300 ease-in-out group"
                >
                  <GoPlusCircle className="w-7 h-7 text-[#0004ff] group-hover:text-[#0004ff]/80 transition-colors duration-200" />
                  <h1 style={{ textShadow: '2px 2px 6px #0004ff' }}>
                    Add product
                  </h1>
                </Link>
              </AnimatePresence>
              <hr className="bg-gradient-to-r from-[#7e2dff] to-[#0004ff] h-[1px] border-0" />
              {!logOutState ? (
                <motion.div variants={contentVariants} className="text-sm mt-4">
                  <motion.button
                    className="w-full bg-[#1c0d0d] hover:bg-[#2d1616] duration-300 text-red-600 font-medium px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    onClick={onClickLogout}
                    whileTap={{ scale: 0.98 }}
                    style={{ textShadow: '2px 2px 6px rgb(220, 38, 38)' }}
                  >
                    <LogOut />
                    Sign out
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  className="w-full bg-[#1c0d0d]  hover:bg-[#2d1616] duration-300 text-red-600 font-medium px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  onClick={onClickLogout}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/signIn">
                    {' '}
                    <LogIn />
                    Sign in
                  </Link>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
