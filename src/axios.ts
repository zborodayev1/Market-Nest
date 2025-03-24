import axios from 'axios';
import { getApiUrl } from './config';

const instance = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

export default instance;
