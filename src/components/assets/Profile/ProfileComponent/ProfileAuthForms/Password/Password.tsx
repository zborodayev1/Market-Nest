import { AnimatePresence, motion } from 'framer-motion'
import { DefForm } from './forms/DefForm'
import { useState } from 'react'
import { ForgotPassForm } from './forms/ForgotPassForm'
import { Code } from './forms/Code'

interface Props {
  onSuccess: () => void
}
export const Password = (props: Props) => {
  const [passwordPageState, setPasswordPageState] = useState<
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
        {passwordPageState === 'default' && <DefForm onSuccess={onSuccess} />}
        {passwordPageState === 'forgotPass' && (
          <ForgotPassForm setPPS={(state) => setPasswordPageState(state)} />
        )}
        {passwordPageState === 'code' && (
          <Code
            setPPS={(state) => setPasswordPageState(state)}
            onSuccess={onSuccess}
          />
        )}
        {passwordPageState === 'default' && (
          <button onClick={() => setPasswordPageState('forgotPass')}>
            Forgot password
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
