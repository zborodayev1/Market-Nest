import { Link } from 'react-router-dom'
import React from 'react'
import {
  markNotificationAsRead,
  Notification,
} from '../../redux/slices/notifications'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { CircleCheck, CircleEllipsis, CircleX } from 'lucide-react'

interface Props {
  notification: Notification
  onSuccess: () => void
}

const NotiFormMemo: React.FC<Props> = ({ notification, onSuccess }) => {
  const dispatch: AppDispatch = useDispatch()

  const onClick = () => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id.toString()))
      onSuccess()
    }
  }

  return (
    <button
      onClick={onClick}
      className={`w-[200px] min-h-[60px] p-3 px-3 bg-[#fafafa] text-sm shadow-lg border-2 ${
        notification.actionType === 'approved' ||
        notification.actionType === 'created'
          ? 'border-green-600 '
          : notification.actionType === 'rejected'
            ? 'border-red-600 '
            : 'border-blue-600 '
      } border-gray-950 rounded-lg hover:-translate-y-1 duration-300 relative`}
    >
      <Link to={`/noti/product/${notification.productId}`}>
        <div className="flex z-20 items-center">
          <div className="absolute top-[-8px] left-[-8px]">
            {notification.actionType === 'created' ||
            notification.actionType === 'approved' ? (
              <CircleCheck className="text-green-600 bg-white rounded-full" />
            ) : notification.actionType === 'rejected' ? (
              <CircleX className="text-red-600 bg-white rounded-full" />
            ) : (
              <CircleEllipsis className="text-blue-600 bg-white rounded-full" />
            )}
          </div>

          <div className="flex justify-center">
            <h1 className="">{notification.title}</h1>
          </div>
        </div>

        {!notification.isRead && (
          <div>
            <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping top-1 right-1 z-10"></div>
            <div className="absolute w-2 h-2 bg-emerald-500 rounded-full top-1 right-1 z-10"></div>
          </div>
        )}
      </Link>
    </button>
  )
}

export const NotiForm = React.memo(NotiFormMemo)
