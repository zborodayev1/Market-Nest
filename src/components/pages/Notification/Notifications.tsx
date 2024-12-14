import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { useEffect, useState } from 'react'
import {
  fetchNotifications,
  Notification,
} from '../../redux/slices/notifications'
import { NotiForm } from './NotiForm'
import { CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'

export const Notifications = () => {
  const dispatch: AppDispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  const { notifications, status, error, totalPages } = useSelector(
    (state: RootState) => state.notifications
  )

  useEffect(() => {
    dispatch(fetchNotifications({ page, limit }))
  }, [dispatch, page, limit])

  //   const updateLimit = (newLimit: number) => setLimit(newLimit)
  const updatePage = (newPage: number) => setPage(newPage)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h1 className="flex justify-center mt-2 text-2xl font-bold">
        Notifications
      </h1>

      {status === 'failed' && (
        <div>{error || 'Failed to load notifications'}</div>
      )}

      <div className="flex gap-4 justify-center mt-5">
        {status === 'succeeded' && notifications.length > 0 ? (
          <div className="flex-col">
            {notifications.map((notification: Notification) => (
              <div className="mb-4">
                <NotiForm notification={notification} />
              </div>
            ))}
          </div>
        ) : status !== 'loading' ? (
          <div>No notifications available.</div>
        ) : (
          <CircularProgress color="inherit" />
        )}
      </div>

      <div className="">
        <div className="flex justify-center gap-2 mt-3 mb-5">
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number}
              onClick={() => updatePage(number + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ease-linear ${
                page === number + 1
                  ? 'bg-[#3C8737] hover:bg-[#2B6128] text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              }`}
            >
              {number + 1}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
