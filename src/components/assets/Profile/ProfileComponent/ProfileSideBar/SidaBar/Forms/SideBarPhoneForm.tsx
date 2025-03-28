import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Phone } from '../../../ProfileAuthForms/Phone/Phone';

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

export const SideBarPhoneForm: React.FC<Props> = (props) => {
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
              ChangePassword: false,
              ChangePhone: !prev.ChangePhone,
            }))
          }
          className="hover:bg-[#E4E4E4] p-2 py-3 rounded-lg flex justify-between items-center gap-1 w-full transition-colors duration-300 ease-in-out delay-50"
        >
          <div className="">
            <span>Change phone:</span>
          </div>

          <motion.div
            animate={{
              rotate: changeProfileState.ChangePhone ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown style={{ width: 17 }} />
          </motion.div>
        </button>
      </motion.div>
      <AnimatePresence mode="wait">
        {changeProfileState.ChangePhone && (
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
            <Phone
              onSuccess={() =>
                setChangeProfileState((prev) => ({
                  ...prev,
                  ChangePhone: !prev.ChangePhone,
                }))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
