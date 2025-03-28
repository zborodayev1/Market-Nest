import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Password } from '../../../ProfileAuthForms/Password/Password';

interface Props {
  changeProfileState: {
    ChangeName: boolean;
    ChangePassword: boolean;
    ChangeEmail: boolean;
    ChangePhone: boolean;
  };
  setChangeProfileState: React.Dispatch<
    React.SetStateAction<{
      ChangeName: boolean;
      ChangePassword: boolean;
      ChangeEmail: boolean;
      ChangePhone: boolean;
    }>
  >;
}

export const SideBarPasswordForm: React.FC<Props> = (props) => {
  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    whileHover: {
      scale: 1.2,
      transition: { duration: 0.2 },
    },
  };

  const { changeProfileState, setChangeProfileState } = props;
  return (
    <div className="">
      <motion.div variants={contentVariants} className="text-sm font-bold">
        <button
          onClick={() =>
            setChangeProfileState((prev) => ({
              ...prev,
              ChangeEmail: false,
              ChangeName: false,
              ChangePassword: !prev.ChangePassword,
              ChangePhone: false,
            }))
          }
          className="hover:bg-[#E4E4E4] p-2 py-3 rounded-lg flex justify-between items-center gap-1 w-full transition-colors duration-300 ease-in-out delay-50"
        >
          <div>Change password</div>

          <motion.div
            animate={{
              rotate: changeProfileState.ChangePassword ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown style={{ width: 17 }} />
          </motion.div>
        </button>
      </motion.div>
      <AnimatePresence mode="wait">
        {changeProfileState.ChangePassword && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
            className="mt-2"
          >
            <Password
              onSuccess={() =>
                setChangeProfileState((prev) => ({
                  ...prev,
                  ChangePassword: !prev.ChangePassword,
                }))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
