import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Code } from './forms/Code';
import { DefForm } from './forms/DefForm';
import { ForgotPassForm } from './forms/ForgotPassForm';

interface Props {
  onSuccess: () => void;
}
export const Phone = (props: Props) => {
  const [phonePageState, setPhonePageState] = useState<
    'default' | 'forgotPass' | 'code'
  >('default');
  const { onSuccess } = props;
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
          <button
            className="p-1 px-3 rounded-lg text-[#000] bg-[#E5E7EB] hover:text-[#fff] hover:bg-[#2b6128] transition-colors duration-200 ease-linear delay-50"
            onClick={() => setPhonePageState('forgotPass')}
          >
            Forgot password
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
