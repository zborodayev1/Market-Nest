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
  console.log(notification);
  const handleBack = () => {
    setFullNoti({ state: 'home', notification: null });
  };

  const handleGTP = () => {
    onSuccess();
    nav(`/product/${notification?.notification?.productId}`);
  };

  return (
    <div className="mt-5">
      <div className="flex items-center">
        <div className="flex justify-center">
          <h1 className="text-black">{notification?.notification?.title}</h1>
        </div>
      </div>
      <div className="flex justify-center relative top-5 gap-4">
        <button
          onClick={handleGTP}
          className="py-1 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-black transition-colors duration-200 ease-linear"
        >
          Product
        </button>
        <button
          onClick={handleBack}
          className="py-1 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-black transition-colors duration-200 ease-linear"
        >
          Back
        </button>
      </div>
    </div>
  );
};
