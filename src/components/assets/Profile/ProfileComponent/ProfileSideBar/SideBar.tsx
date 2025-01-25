import { AnimatePresence, motion } from 'framer-motion'
import { AppDispatch, persistor } from '../../../../redux/store'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUserProfile } from '../../../../redux/slices/auth'
import { ChevronDown, LogOut, PackageCheck } from 'lucide-react'
import CloseIcon from '@mui/icons-material/Close'
import { UserData } from '../ProfileAuthForms/UserData'
import { Email } from '../ProfileAuthForms/Email'
import { Password } from '../ProfileAuthForms/Password/Password'
import { Link } from 'react-router-dom'
import { ChangeAvatar } from './ChangeAvatar/ChangeAvatar'

interface Props {
  setOpen: (value: boolean) => void
  open: boolean
}

export const SideBar = (props: Props) => {
  const [logOutState, setLogOutState] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const { setOpen, open } = props
  const userData = useSelector(selectUserProfile)

  const [state, setState] = useState<{
    ChangeName: boolean
    ChangePassword: boolean
    ChangeEmail: boolean
  }>({
    ChangeName: false,
    ChangePassword: false,
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

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    whileHover: {
      scale: 1.2,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div>
      {open && (
        <div className="fixed top-0 right-0 bg-[#fff] border-l-[2px] border-slate-300 shadow-md min-w-[420px] h-screen p-3 overflow-hidden">
          <div className="fixed right-6 top-6">
            <motion.button
              className="hover:bg-[#E4E4E4] duration-300 w-[35px] h-[35px] rounded-lg"
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
                <ChangeAvatar />
                <motion.button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      ChangeName: !prev.ChangeName,
                      ChangeEmail: false,
                      ChangePassword: false,
                    }))
                  }
                  className="hover:bg-[#E4E4E4] p-2 py-3 rounded-xl flex items-center gap-1 transition-colors duration-300 ease-in-out"
                >
                  <div className="">
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
                  className="hover:bg-[#E4E4E4] p-2 py-3 rounded-xl flex items-center gap-1 w-full transition-colors duration-300 ease-in-out"
                >
                  <div className="">
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
                  className="hover:bg-[#E4E4E4] p-2 py-3 rounded-lg flex items-center gap-1 w-full transition-colors duration-300 ease-in-out"
                >
                  <div className="">Change password</div>

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
              </AnimatePresence>
              <hr className="bg-[#212121]" />
              {userData?.role === 'admin' && (
                <div>
                  <div className=" hover:bg-[#e4e4e4] z-10  p-2  transition-colors duration-300 rounded-lg ease-in-out flex items-center mb-2">
                    <Link
                      className="mx-1 flex gap-2 items-center "
                      to="/products-pending"
                    >
                      <h1 className="text-sm font-bold text-[#212121]  transition-colors duration-200 ">
                        Pending Products
                      </h1>
                      <PackageCheck className="w-7 h-7 text-[#212121] transition-colors duration-200" />
                    </Link>
                  </div>
                </div>
              )}
              <motion.div variants={contentVariants} className="text-sm mt-4">
                <motion.button
                  className="w-full bg-[#f5b3b3] transition-transform  hover:-translate-y-1  ease-in-out hover:bg-[#f8a2a2] duration-300 text-red-600 font-medium px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                  onClick={onClickLogout}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut />
                  Sign out
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
