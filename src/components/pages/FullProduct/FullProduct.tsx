import { CircularProgress } from '@mui/material'
import axios from '../../../axios'
import { useState, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { IoBag } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { addToBag } from '../../redux/slices/products'

export const FullProduct = () => {
  const [data, setData] = useState<any>(null)
  const [err, setErr] = useState(false)
  const { id } = useParams()
  const dispatch = useDispatch()

  const handleAddToBag = () => {
    if (data?._id) {
      dispatch(addToBag(data._id))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/products/${id}`)
        console.log('Response:', response.data) // Логируем данные, чтобы проверить структуру

        // Убираем обращение к doc, так как данных нет в поле doc
        setData(response.data)
      } catch (err) {
        console.warn('Error fetching product:', err)
        setErr(true)
      }
    }

    fetchData()
  }, [id])

  if (err) {
    return <Navigate to="/" />
  }

  if (!data) {
    return (
      <div className="w-screen fixed top-[200px] flex justify-center">
        <CircularProgress
          size={50}
          sx={{
            color: '#000',
            position: 'absolute',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      </div>
    )
  }

  return (
    <div className=" ">
      <div>
        <h1 className="">{data.price}</h1>
        <h1>{data.name}</h1>
        <img
          src={data.image}
          className=" min-h-[100px] min-w-[100px]  max-h-[600px] max-w-[600px]"
          alt={data.name} // Добавлен alt для доступности
        />
        <h1>{data.viewsCount}</h1>
        <h1>{data.tags}</h1>
      </div>
      <div className="flex items-end mb-2">
        <button onClick={handleAddToBag} className="flex gap-2">
          add to <IoBag style={{ marginTop: '5px' }} />
        </button>
      </div>
    </div>
  )
}
