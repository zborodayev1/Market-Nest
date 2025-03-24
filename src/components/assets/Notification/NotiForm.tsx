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
        className={`w-[340px] h-[60px] p-3 px-5 bg-[#fafafa] hover:bg-[#e4e4e4] text-sm duration-300 relative`}
      >
        <div className="flex gap-2 items-center">
          {!notification.isRead ? (
            <div>
              <div className="absolute top-[25px] left-3 w-2 h-2 bg-blue-500 rounded-full animate-ping z-10"></div>
              <div className="absolute top-[25px] left-3 w-2 h-2 bg-blue-500 rounded-full z-10"></div>
            </div>
          ) : (
            <div>
              <div className="absolute top-[25px] left-3 w-2 h-2 bg-blue-500 rounded-full z-10"></div>
            </div>
          )}

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
      </button>
    </>
  );
};

export const NotiForm = React.memo(NotiFormMemo);
