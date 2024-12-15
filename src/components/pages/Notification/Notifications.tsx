import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { useEffect, useState, useCallback } from 'react'
import {
  fetchNotifications,
  Notification,
} from '../../redux/slices/notifications'
import { NotiForm } from './NotiForm'
import { CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'

interface Props {
  onSuccess: () => void
}

export const Notifications = (props: Props) => {
  const dispatch: AppDispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<string>('unread')
  const limit = 4
  const { onSuccess } = props

  const [loadedData, setLoadedData] = useState<Record<string, Notification[]>>(
    {}
  )
  const { status, error, totalPages } = useSelector(
    (state: RootState) => state.notifications
  )

  const cacheKey = `${filter}-${page}`
  const notifications = loadedData[cacheKey] || []

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

  const updatePage = (newPage: number) => {
    if (newPage === page) return
    setPage(newPage)
  }

  const updateFilter = (newFilter: string) => {
    if (newFilter === filter) return
    setFilter(newFilter)
    setPage(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.4 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="text-sm"
    >
      <h1 className="flex justify-center mt-2 text-2xl font-bold">
        Notifications
      </h1>

      {status === 'failed' && (
        <div className="flex justify-center text-red-500">
          {error || 'Failed to load notifications'}
        </div>
      )}

      <div className="flex gap-4 justify-center mt-5">
        {status === 'succeeded' && notifications.length > 0 ? (
          <div className="col-3">
            {notifications.map((notification: Notification) => (
              <div key={notification._id} className="mb-3">
                <NotiForm onSuccess={onSuccess} notification={notification} />
              </div>
            ))}
          </div>
        ) : status !== 'loading' ? (
          <div>No notifications available.</div>
        ) : (
          <CircularProgress color="inherit" />
        )}
      </div>

      {/* Фильтры */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => updateFilter('read')}
          disabled={filter === 'read'}
          className={`py-1 px-4 rounded-xl transition-colors duration-300 ease-linear ${
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
          className={`py-1 px-4 rounded-xl transition-colors duration-300 ease-linear ${
            filter === 'unread'
              ? 'bg-[#3C8737] text-white hover:bg-[#2B6128]'
              : 'bg-gray-200 hover:bg-gray-300 text-black'
          }`}
        >
          Unread
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-3 mb-5">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number}
            onClick={() => updatePage(number + 1)}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-300 ease-linear ${
              page === number + 1
                ? 'bg-[#3C8737] hover:bg-[#2B6128] text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-black'
            }`}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
