import { AnimatePresence, motion } from 'framer-motion';
import React, { RefObject, useEffect, useState } from 'react';
import { Notifications } from '../Notification/Notifications';

interface Props {
  isNotiOpen: boolean;
  notificationRef: RefObject<HTMLDivElement>;
  onSuccess: () => void;
  buttonRef: RefObject<HTMLButtonElement> | null;
}

export const NotiHeaderDropDown: React.FC<Props> = ({
  isNotiOpen,
  notificationRef,
  onSuccess,
  buttonRef,
}) => {
  const [position, setPosition] = useState({ position: 0 });

  useEffect(() => {
    if (buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        position: (350 - rect.width) / 2,
      });
    }
  }, [isNotiOpen]);

  return (
    <div>
      <div style={{ right: -position.position }} className={`absolute z-30`}>
        <AnimatePresence>
          {isNotiOpen && (
            <motion.div
              ref={notificationRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  y: { duration: 0.2, delay: 0.01, ease: 'easeInOut' },
                  opacity: { duration: 0.2, ease: 'easeInOut' },
                },
              }}
              exit={{
                opacity: 0,
                y: -20,
                transition: {
                  y: { duration: 0.2, ease: 'easeInOut' },
                  opacity: { duration: 0.2, delay: 0.01, ease: 'easeInOut' },
                },
              }}
              className="flex justify-center bg-[#fafafa] mt-3 border-slate-500 border-2 rounded-xl z-20 w-[350px] px-[50px] min-h-[340px] max-h-[1440px]"
            >
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <Notifications onSuccess={onSuccess} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
