import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfileData, selectUserProfile } from '../../../redux/slices/auth'
import { Avatar } from '@mui/material'
import { CgProfile } from 'react-icons/cg'
import { motion } from 'motion/react'

interface Props {
  onSuccess: () => void
}

export const ProdileHeader = (props: Props) => {
  const { onSuccess } = props
  const dispatch = useDispatch()
  const userData = useSelector(selectUserProfile)

  useEffect(() => {
    const loadProfileData = () => {
      dispatch(fetchProfileData())
    }

    loadProfileData()
  }, [dispatch])

  const handleCLick = () => {
    onSuccess()
  }

  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="group">
      <button
        onClick={handleCLick}
        className={`mx-2 flex flex-col items-center  ease-in-out`}
      >
        <div
          className="shadow-lg rounded-full relative flex items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          {userData?.avatarUrl ? (
            <motion.div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              initial={{
                boxShadow: '4px -4px 10px #7e2dff, -4px 4px 10px #0004ff',
              }}
              animate={{
                boxShadow: isHovered
                  ? '-4px 4px 10px #7e2dff, 4px -4px 10px #0004ff'
                  : '4px -4px 10px #7e2dff, -4px 4px 10px #0004ff',
                transition: { duration: 0.5 },
              }}
              exit={{
                boxShadow: '4px -4px 10px #7e2dff, -4px 4px 10px #0004ff',
              }}
              className="rounded-full w-[60px]"
            >
              <Avatar src={userData.avatarUrl} />
              <div className="fixed top-[20px] right-[20px] rounded-full w-10 h-10 bg-black/50 opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
            </motion.div>
          ) : (
            <div>
              <CgProfile
                className="w-10 h-10 text-[#7e2dff] group-hover:text-[#7e2dff]/80 transition-colors duration-200"
                style={{ width: 35, height: 40 }}
              />
              <div className="fixed top-[20px] rounded-full right-[20px] w-10 h-10 bg-black/50 opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
            </div>
          )}
        </div>
        <h1
          className="text-sm text-[#7e2dff]   group-hover:text-[#7e2dff]/80 transition-colors duration-100"
          style={{
            textShadow: '2px 2px 6px #7e2dff, -2px -2px 6px #7e2dff',
          }}
        >
          profile
        </h1>
      </button>
    </div>
  )
}
