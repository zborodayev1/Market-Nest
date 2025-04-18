import { CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAllNotificationsReq,
  fetchNotificationReq,
  markAllNotificationsAsReadReq,
} from '../../../redux/slices/notificationSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { NotificationType } from '../../../redux/types/notification.type';
import { FullNotiForm } from './FullNotiForm';
import { NotiForm } from './NotiForm';

interface FullNoti {
  state: string;
  notification: NotificationType | null;
}

interface Props {
  onSuccess: () => void;
}

export const Notifications: React.FC<Props> = ({ onSuccess }) => {
  const dispatch: AppDispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('unread');
  const limit = 4;
  const { notifications, status, totalPages } = useSelector(
    (state: RootState) => state.notifications
  );
  const [fullNoti, setFullNoti] = useState<FullNoti>({
    state: 'home',
    notification: null,
  });
  const buttonStyles =
    'px-4 py-1 text-md rounded-xl bg-gray-200 hover:bg-[#1f5e1c] hover:text-white delay-50  transition-colors duration-200 ease-linear cursor-pointer';

  useEffect(() => {
    dispatch(fetchNotificationReq({ page, limit, filter }));
  }, [dispatch, page, filter, limit]);

  const markAsRead = () => {
    dispatch(markAllNotificationsAsReadReq());
    dispatch(fetchNotificationReq({ page, limit, filter }));
  };

  const deleteAll = () => {
    dispatch(deleteAllNotificationsReq());
    dispatch(fetchNotificationReq({ page, limit, filter }));
  };

  const refresh = useCallback(() => {
    dispatch(fetchNotificationReq({ page, limit, filter }));
  }, [dispatch, page, limit, filter]);

  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-3">Notifications</h1>
      <div className="h-[1px] bg-[#E5E7EB] mt-3 w-[370px]" />
      {filter === 'unread' && fullNoti.state === 'home' ? (
        <div className="flex justify-center text-2xl mt-3 font-bold">
          <h1>Unread</h1>
        </div>
      ) : fullNoti.state === 'home' ? (
        <div className="flex justify-center text-2xl mt-3 font-bold">
          <h1>Read</h1>
        </div>
      ) : (
        <div className="flex justify-center text-2xl mt-3 font-bold">
          <h1>Full Notification</h1>
        </div>
      )}
      <div className="">
        {status === 'succeeded' &&
        notifications.length > 0 &&
        fullNoti.state === 'home' ? (
          <div className="col-3">
            {notifications.map((notification: NotificationType) => (
              <div key={notification._id} className="">
                <NotiForm
                  notification={notification}
                  onSuccess={(state: FullNoti) => setFullNoti(state)}
                />
              </div>
            ))}
          </div>
        ) : status === 'succeeded' &&
          fullNoti.state === 'home' &&
          notifications.length === 0 ? (
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, filter: 'blur(2px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(2px)' }}
              transition={{ duration: 0.2 }}
              className="p-3"
            >
              No notifications available for this tag. Try to
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={refresh}
                className="z-20 mx-1"
              >
                <b className="cursor-pointer">refresh</b>
              </motion.button>
              the page.
            </motion.div>
          </div>
        ) : (
          fullNoti.state === 'home' &&
          status === 'loading' && (
            <div className="flex justify-center">
              <CircularProgress color="inherit" style={{ marginTop: 12 }} />
            </div>
          )
        )}
      </div>

      {fullNoti.state === 'full' && (
        <FullNotiForm
          setFullNoti={setFullNoti}
          notification={fullNoti}
          onSuccess={onSuccess}
        />
      )}

      {status !== 'loading' && fullNoti.state === 'home' && (
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => setFilter('read')} className={buttonStyles}>
            Read
          </button>
          <button onClick={() => setFilter('unread')} className={buttonStyles}>
            Unread
          </button>
        </div>
      )}

      {notifications &&
        notifications.length > 0 &&
        fullNoti.state === 'home' &&
        status !== 'loading' && (
          <div className="flex justify-center mt-2 gap-2">
            <button onClick={markAsRead} className={buttonStyles}>
              Read All
            </button>
            <button onClick={deleteAll} className={buttonStyles}>
              Delete All
            </button>
          </div>
        )}

      {notifications &&
        notifications.length > 0 &&
        fullNoti.state === 'home' &&
        status !== 'loading' && (
          <div className="flex justify-center gap-2 mt-3 mb-5">
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number}
                onClick={() => setPage(number + 1)}
                className="px-3 py-1 rounded-full bg-gray-200 hover:bg-[#1f5e1c] hover:text-white transition-colors duration-200 ease-linear delay-50"
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}
    </>
  );
};
