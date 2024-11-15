import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="h-screen bg-[#fafafa]">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/"
          className="flex justify-center p-5 text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
        >
          Not Found
        </Link>
      </motion.div>
    </div>
  )
}
