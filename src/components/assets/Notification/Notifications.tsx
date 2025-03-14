import { CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAllNotificationsReq,
  fetchNotificationReq,
  getOneNotificationReq,
  markAllNotificationsAsReadReq,
  selectFullNotifi,
} from '../../../redux/slices/notificationSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { Notification } from '../../../redux/types/notification';
import { FullNotiForm } from './FullNotiForm';
import { NotiForm } from './NotiForm';

interface FullNoti {
  state: string;
  id: string;
}

interface Props {
  onSuccess: () => void;
}

const NotificationsComponent: React.FC<Props> = ({ onSuccess }) => {
  const dispatch: AppDispatch = useDispatch();
  const fullNotifi = useSelector(selectFullNotifi);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('unread');
  const limit = 4;
  const {
    data: notifications,
    status,
    totalPages,
  } = useSelector((state: RootState) => state.notifications);
  const [fullNoti, setFullNoti] = useState<FullNoti>({ state: 'home', id: '' });

  useEffect(() => {
    dispatch(fetchNotificationReq({ page, limit, filter }));
  }, [dispatch, page, filter]);

  useEffect(() => {
    if (fullNoti.state === 'full' && fullNoti.id) {
      dispatch(getOneNotificationReq({ id: fullNoti.id }));
    }
  }, [dispatch, fullNoti]);

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

  console.log({ status, notifications, fullNoti });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
      >
        <h1 className="text-2xl font-bold text-center mt-5">Notifications</h1>
        <hr className="mt-5 bg-gray-200 w-72 h-0.5 mx-auto" />
        {status === 'succeeded' &&
        notifications.length > 0 &&
        fullNoti.state === 'home' ? (
          <div className="col-3">
            {notifications.map((notification: Notification) => (
              <div key={notification._id} className="mt-3">
                <NotiForm
                  notification={notification}
                  onSuccess={(state: FullNoti) => setFullNoti(state)}
                />
              </div>
            ))}
          </div>
        ) : status === 'succeeded' && fullNoti.state === 'home' ? (
          <div className="flex mt-3">
            <motion.div
              initial={{ opacity: 0, filter: 'blur(2px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(2px)' }}
              transition={{ duration: 0.2 }}
            >
              No notifications available for this tag. Try to
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={refresh}
                className="z-20 mx-1"
              >
                <b>refresh</b>
              </motion.button>
              the page.
            </motion.div>
          </div>
        ) : (
          fullNoti.state === 'home' &&
          status === 'loading' && (
            <CircularProgress color="inherit" style={{ marginTop: 12 }} />
          )
        )}

        {fullNoti.state === 'full' && (
          <FullNotiForm
            setFullNoti={setFullNoti}
            notification={fullNotifi}
            onSuccess={onSuccess}
          />
        )}

        {status !== 'loading' && fullNoti.state === 'home' && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setFilter('read')}
              className="px-4 py-1 rounded-xl bg-gray-200"
            >
              Read
            </button>
            <button
              onClick={() => setFilter('unread')}
              className="px-4 py-1 rounded-xl bg-gray-200"
            >
              Unread
            </button>
          </div>
        )}

        {notifications &&
          notifications.length > 0 &&
          fullNoti.state === 'home' &&
          status !== 'loading' && (
            <div className="flex justify-center mt-2 gap-2">
              <button
                onClick={markAsRead}
                className="py-1 px-3 rounded-xl bg-gray-200"
              >
                Read All
              </button>
              <button
                onClick={deleteAll}
                className="py-1 px-3 rounded-xl bg-gray-200"
              >
                Delete All
              </button>
            </div>
          )}

        {notifications &&
          notifications.length > 0 &&
          fullNoti.state === 'home' && (
            <div className="flex justify-center gap-2 mt-3 mb-5">
              {[...Array(totalPages).keys()].map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number + 1)}
                  className="px-3 py-1 rounded-xl bg-gray-200"
                >
                  {number + 1}
                </button>
              ))}
            </div>
          )}
      </motion.div>
    </AnimatePresence>
  );
};

export const Notifications = React.memo(NotificationsComponent);
