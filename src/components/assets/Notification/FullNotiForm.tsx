import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationType } from '../../../redux/types/notification.type';
interface Props {
  notification?: { state: string; notification: NotificationType | null };
  setFullNoti: (noti: {
    state: string;
    notification: NotificationType | null;
  }) => void;
  onSuccess: () => void;
}

export const FullNotiForm: React.FC<Props> = ({
  notification,
  onSuccess,
  setFullNoti,
}) => {
  const nav = useNavigate();
  const buttonStyle =
    'py-1 px-4 rounded-xl bg-gray-200 hover:bg-[#1f5e1c] hover:text-white text-black transition-colors duration-200 ease-linear delay-50 ';

  const handleBack = () => {
    setFullNoti({ state: 'home', notification: null });
  };

  const handleGTP = () => {
    onSuccess();
    nav(`/noti/product/${notification?.notification?.productId}`);
  };

  return (
    <div className=" p-3">
      <div className="flex bg-gray-200 p-3 rounded-lg min-h-[100px] items-center">
        <div className="flex justify-center items-center gap-3">
          <div>
            <div className="w-2 h-2 bg-blue-500 rounded-full z-10"></div>
          </div>
          <div className="flex whitespace-normal text-base w-full gap-1">
            <h1>{notification?.notification?.title}</h1>
            <h1 className="font-bold">
              {notification?.notification?.productName}
            </h1>
            <h1>{notification?.notification?.title2}</h1>
          </div>
        </div>
      </div>
      {notification?.notification?.actionType !== 'deleted' &&
      notification?.notification?.actionType !== 'order' ? (
        <div className="flex justify-center relative top-5 gap-4">
          <button onClick={handleGTP} className={`${buttonStyle}`}>
            Product
          </button>
          <button onClick={handleBack} className={`${buttonStyle}`}>
            Back
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-2">
          <button onClick={handleBack} className={`${buttonStyle} `}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};
