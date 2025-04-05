import React from 'react';
import { useDispatch } from 'react-redux';
import { markNotificationAsReadReq } from '../../../redux/slices/notificationSlice';
import { AppDispatch } from '../../../redux/store';
import { NotificationType } from '../../../redux/types/notification.type';
interface FullNoti {
  state: string;
  notification: NotificationType;
}

interface Props {
  notification: NotificationType;
  onSuccess: (state: FullNoti) => void;
}

const NotiFormMemo: React.FC<Props> = ({ notification, onSuccess }) => {
  const dispatch: AppDispatch = useDispatch();

  const onClick = () => {
    if (!notification?.isRead) {
      dispatch(
        markNotificationAsReadReq({
          notificationId: notification._id.toString(),
        })
      );
    }
    onSuccess({ state: 'full', notification: notification });
  };

  return (
    <>
      <button
        onClick={onClick}
        className="w-[370px] min-h-[80px] relative flex text-sm items-center rounded-lg my-2 bg-gray-200 hover:bg-[#285E1C]/80 hover:text-white transition-colors duration-300 delay-50 group"
      >
        <div className="flex gap-2 w-full">
          <div className="flex justify-center gap-1 w-full whitespace-normal break-words">
            <h1>{notification.title}</h1>
            <h1 className="font-bold">{notification.productName}</h1>
            <h1>{notification.title2}</h1>
          </div>
        </div>
      </button>
    </>
  );
};

export const NotiForm = React.memo(NotiFormMemo);
