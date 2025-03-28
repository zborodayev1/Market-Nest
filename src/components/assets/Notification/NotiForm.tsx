import { ChevronRight } from 'lucide-react';
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
        className="w-[340px] min-h-[80px] relative flex items-start text-sm p-3 pt-[30px] px-5 bg-[#fafafa] hover:bg-[#e4e4e4] duration-300 delay-50"
      >
        <div className="flex gap-2 w-full">
          {!notification.isRead ? (
            <div>
              <div className="absolute top-[36px] left-3 w-2 h-2 bg-blue-500 rounded-full animate-ping z-10"></div>
              <div className="absolute top-[36px] left-3 w-2 h-2 bg-blue-500 rounded-full z-10"></div>
            </div>
          ) : (
            <div>
              <div className="absolute top-[36px] left-3 w-2 h-2 bg-blue-500 rounded-full z-10"></div>
            </div>
          )}

          <div className="flex flex-col w-full">
            <h1 className="whitespace-normal break-words">
              {notification.title}
            </h1>
          </div>

          <ChevronRight className="h-5 w-4 absolute right-1 top-[30px]" />
        </div>
      </button>
    </>
  );
};

export const NotiForm = React.memo(NotiFormMemo);
