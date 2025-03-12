import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { DefForm } from './forms/DefForm'
import { ForgotPassForm } from './forms/ForgotPassForm'
import { Code } from './forms/Code'

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
        className="max-w-md mx-auto p-6  bg-[#fff] border-[2px] border-[#212121]  rounded-xl shadow-lg space-y-6"
      >
        {phonePageState === 'default' && <DefForm onSuccess={onSuccess} />}
        {phonePageState === 'forgotPass' && (
          <ForgotPassForm setPPS={(state) => setPhonePageState(state)} />
        )}
        {phonePageState === 'code' && (
          <Code
            onSuccess={onSuccess}
            setPPS={(state) => setPhonePageState(state)}
          />
        )}
        {phonePageState === 'default' && (
          <button onClick={() => setPhonePageState('forgotPass')}>
            Forgot password
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
