import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach Bearer token automatically when available
axiosClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(STORAGE_KEYS.TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors, handle expired/invalid token
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Token invalid/expired — clear session so ProtectedRoute redirects to /login
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER);

      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Terjadi kesalahan yang tidak terduga';

    return Promise.reject({ ...error, message });
  }
);

export default axiosClient;
