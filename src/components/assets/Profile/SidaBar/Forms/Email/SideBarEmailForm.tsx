import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../../../../redux/slices/authSlice';
import { Email } from '../../../ProfileAuthForms/Email/Email';

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

export const SideBarEmailForm: React.FC<Props> = (props) => {
  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    whileHover: {
      scale: 1.2,
      transition: { duration: 0.2 },
    },
  };
  const userData = useSelector(selectUserProfile);
  const { changeProfileState, setChangeProfileState } = props;
  return (
    <div className="">
      <motion.div variants={contentVariants} className="text-sm font-bold">
        <button
          onClick={() =>
            setChangeProfileState((prev) => ({
              ...prev,
              ChangeEmail: !prev.ChangeEmail,
              ChangeName: false,
              ChangePassword: false,
              ChangePhone: false,
            }))
          }
          className="hover:bg-gray-200 p-2 py-3 rounded-lg flex justify-between items-center gap-1 w-full transition-colors duration-300 ease-in-out"
        >
          <div className="">
            {userData?.email ? (
              <span>{userData.email}</span>
            ) : (
              <div>Email:</div>
            )}
          </div>

          <motion.div
            animate={{
              rotate: changeProfileState.ChangeEmail ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown style={{ width: 17 }} />
          </motion.div>
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {changeProfileState.ChangeEmail && (
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
            <Email
              onSuccess={() =>
                setChangeProfileState((prev) => ({
                  ...prev,
                  ChangeEmail: !prev.ChangeEmail,
                }))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
