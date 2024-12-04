import { useEffect, useState } from 'react'
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

  return (
    <div className="group px-3">
      <button
        onClick={handleCLick}
        className="mx-2 flex gap-2 items-center   right-0 rounded-full duration-300 ease-in-out group mt-1"
      >
        <div
          className="shadow-lg rounded-full  relative flex items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          {userData?.avatarUrl ? (
            <motion.div className="rounded-full hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <Avatar src={userData.avatarUrl} />
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
      </button>
    </div>
  )
}
