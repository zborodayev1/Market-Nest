import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  clearFullNotifi,
  Notification,
} from '../../../redux/slices/notificationSlice';
interface Props {
  notification?: Notification | null;
  setFullNoti: (noti: { state: string; id: string }) => void;
  onSuccess: () => void;
}

export const FullNotiForm: React.FC<Props> = ({
  notification,
  onSuccess,
  setFullNoti,
}) => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(clearFullNotifi());
    setFullNoti({ state: 'home', id: '' });
  };

  const handleGTP = () => {
    onSuccess();
    nav(`/product/${notification?.productId}`);
  };

  return (
    <div className="mt-5">
      <div className="flex gap-2 items-center">
        <img
          className="w-8 h-8 p-1 pt-[6px] bg-gradient-to-r from-gray-500 to-[#fafafa] rounded-full"
          src={'http://localhost:5173/icon.svg'}
        />
      </div>
      <div className="flex  items-center">
        <div className="flex justify-center">
          <h1 className="">{notification?.title}</h1>
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
