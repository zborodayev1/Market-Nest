import { AnimatePresence, motion } from 'framer-motion'
import { Notifications } from '../Notification/Notifications'
import React, { RefObject } from 'react'

interface Props {
  notiOpen: boolean
  notificationRef: RefObject<HTMLDivElement>
  onSuccess: () => void
}

export const NotiHeaderDropDown: React.FC<Props> = ({
  notiOpen,
  notificationRef,
  onSuccess,
}) => {
  return (
    <div>
      <div className="absolute top-[70px] right-[350px]">
        <AnimatePresence>
          {notiOpen && (
            <motion.div
              ref={notificationRef}
              initial={{ opacity: 0, y: -40 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{ opacity: 0, y: 40 }}
              className="flex justify-center bg-[#fafafa] mt-3 border-slate-500 border-2 rounded-xl z-20 w-[350px] px-[50px] min-h-[340px] max-h-[1440px]"
            >
              <Notifications onSuccess={onSuccess} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
