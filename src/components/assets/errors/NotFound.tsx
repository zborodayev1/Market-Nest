import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="h-screen bg-[#FFFFFF]">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/"
          className="flex justify-center p-5 text-3xl text-black font-bold"
        >
          Not Found
        </Link>
      </motion.div>
    </div>
  )
}
