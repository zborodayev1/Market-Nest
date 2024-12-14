import { Link } from 'react-router-dom'
import {
  markNotificationAsRead,
  Notification,
} from '../../redux/slices/notifications'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'

interface Props {
  notification: Notification
}

export const NotiForm = (props: Props) => {
  const dispatch: AppDispatch = useDispatch()
  const { notification } = props
  const onClick = () => {
    dispatch(markNotificationAsRead(notification._id.toString()))
  }
  return (
    <div className="max-w-[550px] p-2 px-3 bg-[#fafafa]  text-base shadow-xl border border-gray-950 rounded-lg hover:-translate-y-1 duration-300 relative">
      <div className="flex-col min-w-[450px]">
        <Link to={`/notification/${notification.productId}`}>
          <div>
            <h1 className="">{notification.message}</h1>
          </div>
        </Link>
        {notification.productImageUrl && notification.productId && (
          <div className="">
            <Link
              className="flex justify-center"
              to={`/notification/${notification.productId}`}
            >
              <img
                className="max-w-[400px]"
                src={notification.productImageUrl}
              />
            </Link>
          </div>
        )}
      </div>
      <div>
        {notification.productImageUrl && notification.productId && (
          <div className="">
            <Link to={`/product/${notification.productId}`}>
              <button
                onClick={onClick}
                className="bg-[#3C8737] text-white hover:bg-[#2B6128] transition-colors duration-300 ease-linear rounded-xl p-2 w-full"
              >
                Go to the producs
              </button>
            </Link>
          </div>
        )}
      </div>
      {!notification.isRead && (
        <div>
          <div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping top-3 right-3 z-10"></div>
          <div className="absolute w-4 h-4 bg-red-500 rounded-full top-3 right-3 z-10"></div>
        </div>
      )}
    </div>
  )
}
