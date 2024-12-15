import { Link } from 'react-router-dom'
import {
  markNotificationAsRead,
  Notification,
} from '../../redux/slices/notifications'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { CircleAlert, CircleCheck, CircleEllipsis, CircleX } from 'lucide-react'

interface Props {
  notification: Notification
  onSuccess: () => void
}

export const NotiForm = (props: Props) => {
  const dispatch: AppDispatch = useDispatch()
  const { notification, onSuccess } = props

  const onClick = () => {
    onSuccess()
    dispatch(markNotificationAsRead(notification._id.toString()))
  }

  return (
    <button
      onClick={onClick}
      className={`w-[140px] min-h-[60px] p-3 px-3 bg-[#fafafa] text-sm shadow-lg border-2 ${
        notification.type === 'success'
          ? 'border-green-600 shadow-green-600/25'
          : notification.type === 'error'
            ? 'border-red-600 shadow-red-600/25'
            : notification.type === 'info'
              ? 'border-blue-600 shadow-blue-600/25'
              : 'border-yellow-600 shadow-yellow-600/25'
      } border-gray-950 rounded-lg hover:-translate-y-1 duration-300 relative`}
    >
      <Link to={`/noti/product/${notification.productId}`}>
        <div className="flex z-20 items-center">
          <div className="absolute top-[-8px] left-[-8px]">
            {notification.type === 'success' ? (
              <CircleCheck className="text-green-600 bg-white rounded-full" />
            ) : notification.type === 'error' ? (
              <CircleX className="text-red-600 bg-white rounded-full" />
            ) : notification.type === 'info' ? (
              <CircleEllipsis className="text-blue-600 bg-white rounded-full" />
            ) : (
              <CircleAlert className="text-yellow-600 bg-white rounded-full" />
            )}
          </div>

          <div className=" flex justify-center">
            <h1 className="">{notification.title}</h1>
          </div>
        </div>

        {!notification.isRead && (
          <div>
            <div className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping top-1 right-1 z-10"></div>
            <div className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1 z-10"></div>
          </div>
        )}
      </Link>
    </button>
  )
}
