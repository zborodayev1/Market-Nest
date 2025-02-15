import { Avatar } from '@mui/material'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { AppDispatch } from '../../../../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  uploadImage,
  fetchProfileData,
  selectUserProfile,
} from '../../../../../redux/slices/auth'

export const ChangeAvatar = () => {
  const [isHovered, setIsHovered] = useState(false)
  const userData = useSelector(selectUserProfile)
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [change, setChange] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()
  const [file, setFile] = useState<File | null>(null)

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

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => inputFileRef.current?.click()}
        className="relative group items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          animate={{
            filter: isHovered ? 'blur(2px)' : 'blur(0px)',
            transition: { duration: 0.5 },
          }}
          className="rounded-full "
        >
          <Avatar style={{ width: 45, height: 45 }} src={userData?.avatarUrl} />
        </motion.div>

        <div className="absolute inset-0 flex justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-linear">
          <div className="bg-[#fafafa] bg-opacity-90 rounded-full flex items-center justify-center ">
            <span className="text-[#212121] text-xs font-medium">
              Change Avatar
            </span>
          </div>
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
          className="px-3 py-1 bg-blue-50 h-[30px] text-[#212121] border border-[#212121] rounded-md "
        >
          Change
        </motion.button>
      )}
    </div>
  )
}
