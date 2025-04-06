import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../../../../redux/slices/authSlice';
import { UserData } from '../../../ProfileAuthForms/UserData/UserData';

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

export const SideBarUserDataForm: React.FC<Props> = (props) => {
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
      <motion.div
        variants={contentVariants}
        className="text-sm font-bold flex items-center gap-2"
      >
        <button
          onClick={() =>
            setChangeProfileState((prev) => ({
              ...prev,
              ChangeName: !prev.ChangeName,
              ChangeEmail: false,
              ChangePassword: false,
              ChangePhone: false,
            }))
          }
          className="hover:bg-gray-200 p-2 py-3 rounded-lg w-full flex justify-between items-center gap-1 transition-colors duration-300 ease-in-out"
        >
          <div className="">
            {userData?.fullName ? (
              <span>{userData?.fullName}</span>
            ) : (
              <div>User Data:</div>
            )}
          </div>

          <motion.div
            animate={{
              rotate: changeProfileState.ChangeName ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown style={{ width: 17 }} />
          </motion.div>
        </button>
      </motion.div>
      <AnimatePresence mode="wait">
        {changeProfileState.ChangeName && (
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
            <UserData
              onSuccess={() =>
                setChangeProfileState((prev) => ({
                  ...prev,
                  ChangeName: !prev.ChangeName,
                }))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
