import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  limitError: boolean
  setLimitError: React.Dispatch<React.SetStateAction<boolean>>
  PGState: {
    limit: number
    page: number
  }
  setPGState: React.Dispatch<
    React.SetStateAction<{ limit: number; page: number }>
  >
  products: {
    totalPages: number
  }
  focusLimit: boolean
  setFocusLimit: React.Dispatch<React.SetStateAction<boolean>>
  focusPage: boolean
  setFocusPage: React.Dispatch<React.SetStateAction<boolean>>
}

export const PageSettingsForm = (props: Props) => {
  const {
    open,
    setOpen,
    limitError,
    setLimitError,
    PGState,
    setPGState,
    products,
    focusLimit,
    focusPage,
    setFocusLimit,
    setFocusPage,
  } = props

  const changeLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) {
      setLimitError(true)
    } else {
      setLimitError(false)
      setPGState((prevState) => ({
        ...prevState,
        limit: Number(e.target.value),
      }))
    }
  }

  const changePage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageValue = Number(e.target.value)
    if (pageValue > products.totalPages) {
      setPGState((prevState) => ({
        ...prevState,
        page: products.totalPages,
      }))
    } else {
      setPGState((prevState) => ({
        ...prevState,
        page: pageValue,
      }))
    }
  }

  return (
    <div>
      <div className="mt-5 mb-3 flex gap-2 h-10">
        <button
          onClick={() => setOpen((prevState) => !prevState)}
          className={`ml-5 items-center mr-2 flex gap-2 px-3 rounded-xl ${open ? 'bg-[#285E1C] hover:bg-[#3C8737] text-white' : 'hover:bg-[#285E1C] bg-[#E5E7EB] hover:text-white'} transition-colors ease-linear duration-300`}
        >
          <h1>pages</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 25 25"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 7h-9"
              animate={{
                x: open ? -7 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d="M14 17H5"
              animate={{
                x: open ? 7 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              initial={{ cx: 7, cy: 7 }}
              animate={{
                cx: open ? 17 : 7,
                cy: 7,
              }}
              transition={{ duration: 0.3 }}
              r="3"
            />
            <motion.circle
              initial={{ cx: 7, cy: 7 }}
              animate={{
                cx: open ? 17 : 7,
                cy: 7,
              }}
              transition={{ duration: 0.3 }}
              r="2.5"
              fill="white"
            />
            <motion.circle
              initial={{ cx: 17, cy: 17 }}
              animate={{
                cx: open ? 7 : 17,
                cy: 17,
              }}
              transition={{ duration: 0.3 }}
              r="3"
            />
            <motion.circle
              initial={{ cx: 17, cy: 17 }}
              animate={{
                cx: open ? 7 : 17,
                cy: 17,
              }}
              transition={{ duration: 0.3 }}
              r="2.5"
              fill="white"
            />
          </svg>
        </button>
        <AnimatePresence>
          {open && (
            <div className="flex gap-7 items-center">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.3, delay: 0.1 },
                }}
                exit={{
                  opacity: 0,
                  x: 100,
                  transition: { duration: 0.3, delay: 0.4 },
                }}
                className="flex items-center gap-2"
              >
                <h1>products per page:</h1>
                <motion.input
                  initial={{ opacity: 0 }}
                  animate={{
                    borderColor: limitError
                      ? '#dc2626'
                      : focusLimit
                        ? '#fff'
                        : '#d1d5db',
                    backgroundColor: limitError
                      ? 'rgba(239, 68, 68, 0.5)'
                      : focusLimit
                        ? '#3C8737'
                        : '#fafafa',
                    color: limitError
                      ? '#ffffff'
                      : focusLimit
                        ? '#fff'
                        : '#000000',
                    boxShadow: limitError
                      ? '0 0 0 4px rgba(239, 68, 68, 0.5)'
                      : focusLimit
                        ? '0 0 0 4px #3C8737'
                        : '0 0 0 4px rgba(0, 0, 0, 0.1)',
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.3, delay: 0.4 },
                  }}
                  onFocus={() => setFocusLimit(true)}
                  onBlur={() => setFocusLimit(false)}
                  tabIndex={0}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                  }}
                  style={{
                    appearance: 'none',
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                  }}
                  className="w-20 px-3 py-1 border rounded-md focus:outline-none focus:ring-1"
                  type="text"
                  onChange={changeLimit}
                  defaultValue={PGState.limit}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.3, delay: 0.4 },
                }}
                exit={{
                  opacity: 0,
                  x: 100,
                  transition: { duration: 0.3, delay: 0.1 },
                }}
                className="flex items-center gap-2"
              >
                <h1>page:</h1>
                <motion.input
                  initial={{ opacity: 0 }}
                  animate={{
                    borderColor: focusPage ? '#fff' : '#d1d5db',
                    backgroundColor: focusPage ? '#3C8737' : '#fafafa',
                    color: focusPage ? '#fff' : '#000000',
                    boxShadow: focusPage
                      ? '0 0 0 4px #3C8737'
                      : '0 0 0 4px rgba(0, 0, 0, 0.1)',
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.3, delay: 0.1 },
                  }}
                  onFocus={() => setFocusPage(true)}
                  onBlur={() => setFocusPage(false)}
                  tabIndex={0}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                  }}
                  style={{
                    appearance: 'none',
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                  }}
                  className="w-20 px-3 py-1 border rounded-md focus:outline-none focus:ring-1"
                  type="text"
                  onChange={changePage}
                  value={PGState.page}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
