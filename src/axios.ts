import axios from 'axios';
import { getApiUrl } from './config';

const instance = axios.create({
  baseURL: getApiUrl(),
});

instance.interceptors.request.use(
  async (config) => {
    const { store } = await import('./redux/store');
    if (store) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
