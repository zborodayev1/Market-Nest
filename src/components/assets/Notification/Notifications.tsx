import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  Notification,
} from '../../redux/slices/notifications'
import { NotiForm } from './NotiForm'
import { CircularProgress } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  onSuccess: () => void
}

const NotificationsComponent: React.FC<Props> = ({ onSuccess }) => {
  const dispatch: AppDispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<string>('unread')
  const limit = 4

  const [loadedData, setLoadedData] = useState<Record<string, Notification[]>>(
    {}
  )
  const { status, totalPages } = useSelector(
    (state: RootState) => state.notifications
  )

  const [message, setMessage] = useState('')
  const cacheKey = useMemo(() => `${filter}-${page}`, [filter, page])
  const notifications = useMemo(
    () => loadedData[cacheKey] || [],
    [loadedData, cacheKey]
  )

  const loadNotifications = useCallback(async () => {
    if (loadedData[cacheKey]) return

    try {
      const response = await dispatch(
        fetchNotifications({ page, limit, filter })
      ).unwrap()

      setLoadedData((prev) => ({
        ...prev,
        [cacheKey]: response.notifications,
      }))
    } catch (err) {
      console.error('Failed to load notifications:', err)
    }
  }, [dispatch, page, filter, limit, loadedData, cacheKey])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const updatePage = useCallback(
    (newPage: number) => {
      if (newPage === page) return
      setPage(newPage)
    },
    [page]
  )

  const updateFilter = useCallback(
    (newFilter: string) => {
      if (newFilter === filter) return
      setFilter(newFilter)
      setPage(1)
    },
    [filter]
  )

  const markAsRead = useCallback(async () => {
    try {
      const response = await dispatch(markAllNotificationsAsRead()).unwrap()

      if (response.success) {
        setLoadedData({})
        setPage(1)
        loadNotifications()
      }
    } catch (err: unknown) {
      setMessage((err as { message: string }).message)
    }
  }, [dispatch, loadNotifications])

  const deleteAll = useCallback(async () => {
    try {
      const response = await dispatch(deleteAllNotifications()).unwrap()

      if (response.success) {
        setLoadedData({})
        setPage(1)
        loadNotifications()
      }
    } catch (err: unknown) {
      setMessage((err as { message: string }).message)
    }
  }, [dispatch, loadNotifications])

  const refresh = useCallback(() => {
    dispatch(fetchNotifications({ page, limit, filter }))
  }, [dispatch, page, limit, filter])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
        transition={{ duration: 0.2, delay: 0.5 }}
        className="text-base"
      >
        <h1 className="flex justify-center mt-2 text-2xl font-bold">
          Notifications
        </h1>
        {status === 'failed' && (
          <div className="">
            {message}. Try to
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={refresh}
              className="z-20 mx-1"
            >
              <b>refresh</b>
            </motion.button>
            the page.
          </div>
        )}
        <div
          className={`flex gap-4 justify-center ${status === 'failed' ? '' : 'mt-5'}`}
        >
          <AnimatePresence>
            {status === 'succeeded' && notifications.length > 0 ? (
              <div className="col-3">
                {notifications.map((notification: Notification) => (
                  <div className="mt-3">
                    <NotiForm
                      key={notification._id}
                      notification={notification}
                      onSuccess={onSuccess}
                    />
                  </div>
                ))}
              </div>
            ) : status !== 'loading' && status !== 'failed' ? (
              <div className="flex">
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
              status !== 'failed' && <CircularProgress color="inherit" />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {status !== 'loading' && (
            <motion.div
              initial={{ opacity: 0, filter: 'blur(5px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(5px)' }}
              transition={{ duration: 0.2 }}
            >
              {' '}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => updateFilter('read')}
                  disabled={filter === 'read'}
                  className={`py-1 px-4 rounded-xl transition-colors duration-200 ease-linear ${
                    filter === 'read'
                      ? 'bg-[#3C8737] text-white hover:bg-[#2B6128]'
                      : 'bg-gray-200 hover:bg-gray-300 text-black'
                  }`}
                >
                  Read
                </button>
                <button
                  onClick={() => updateFilter('unread')}
                  disabled={filter === 'unread'}
                  className={`py-1 px-4 rounded-xl transition-colors duration-200 ease-linear ${
                    filter === 'unread'
                      ? 'bg-[#3C8737] text-white hover:bg-[#2B6128]'
                      : 'bg-gray-200 hover:bg-gray-300 text-black'
                  }`}
                >
                  Unread
                </button>
              </div>
              <div className="flex justify-center mt-2 gap-2">
                <button
                  onClick={markAsRead}
                  className="py-1 px-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-black transition-colors duration-200 ease-linear"
                >
                  Read All
                </button>
                <button
                  onClick={deleteAll}
                  className="py-1 px-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-black transition-colors duration-200 ease-linear"
                >
                  Delete All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {notifications.length > 0 && (
          <div
            style={
              {
                overflowX: 'auto',
                maxWidth: '200px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              } as React.CSSProperties
            }
            className="flex justify-start gap-2 mt-3 mb-5"
          >
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number}
                onClick={() => updatePage(number + 1)}
                className={`min-w-7 min-h-7 flex items-center justify-center rounded-full transition-colors duration-300 ease-linear ${
                  page === number + 1
                    ? 'bg-[#3C8737] hover:bg-[#2B6128] text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-black'
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export const Notifications = React.memo(NotificationsComponent)
