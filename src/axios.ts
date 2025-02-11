import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://195.210.47.125:3000', // http://195.210.47.125:3000 http://localhost:3000
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
