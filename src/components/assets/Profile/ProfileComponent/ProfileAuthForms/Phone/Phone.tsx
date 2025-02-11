import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { DefForm } from './forms/DefForm'

interface Props {
  onSuccess: () => void
}
export const Phone = (props: Props) => {
  const [phonePageState, setPhonePageState] = useState<
    'default' | 'forgotPass' | 'code'
  >('default')
  const { onSuccess } = props
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md mx-auto p-6  bg-[#fff] border-[2px] border-[#212121] dark:bg-gray-900 rounded-xl shadow-lg space-y-6"
      >
        {phonePageState === 'default' && <DefForm onSuccess={onSuccess} />}
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setPhonePageState('forgotPass')}
      >
        forgot pass
      </motion.button>
    </AnimatePresence>
  )
}
