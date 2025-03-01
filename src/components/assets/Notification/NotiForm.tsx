import React from 'react'
import {
  markNotificationAsRead,
  Notification,
} from '../../redux/slices/notifications'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { ChevronRight } from 'lucide-react'

interface FullNoti {
  state: string
  id: string
}

interface Props {
  notification: Notification
  onSuccess: (state: FullNoti) => void
}

const NotiFormMemo: React.FC<Props> = ({ notification, onSuccess }) => {
  const dispatch: AppDispatch = useDispatch()

  const onClick = () => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id.toString()))
    }
    onSuccess({ state: 'full', id: notification._id.toString() })
  }

  return (
    <>
      <button
        onClick={onClick}
        className={`w-[300px] h-[50px] p-3 px-3 bg-[#fafafa] text-sm duration-300 relative`}
      >
        <div className="flex gap-2 items-center">
          <img
            className="w-7 h-7 p-1 bg-gradient-to-r from-gray-500 to-[#fafafa] rounded-full"
            src={'./icon.svg'}
          />
          <div className="flex z-20 items-center">
            <div className="flex justify-center">
              <h1
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '215px',
                }}
                className=""
              >
                {notification.title}
              </h1>
            </div>
          </div>
          <div>
            <ChevronRight className={`h-5 w-5 absolute right-2 top-[15px] }`} />
          </div>
        </div>

        {!notification.isRead && (
          <div>
            <div className="absolute w-2 h-2 bg-emerald-500/50 rounded-full animate-ping top-0 right-0 z-10"></div>
            <div className="absolute w-2 h-2 bg-emerald-500/50 rounded-full top-0 right-0 z-10"></div>
          </div>
        )}
      </button>
      <hr className="my-2 bg-[#f0f0f0] h-[2px]" />
    </>
  )
}

export const NotiForm = React.memo(NotiFormMemo)
