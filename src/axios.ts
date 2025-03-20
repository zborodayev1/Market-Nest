import axios from 'axios';

const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000/api';
  }
  return `${window.location.origin}/api`;
};

const instance = axios.create({
  baseURL: getBaseUrl(),
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
