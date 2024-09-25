// File: src/api/admin/index.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const LOG_PREFIX = '[adminApi]';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(`${LOG_PREFIX} Unauthorized:`, error.response.data);
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Interceptors for logging
adminApi.interceptors.request.use(
  (config) => {
    console.log('Outgoing request:', config.method, config.url, JSON.stringify(config.data, null, 2));
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => {
    console.log('Incoming response:', response.status, JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error('Response error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export * from './auth';
export * from './users';
export * from './courses';
export * from './leads';

export default adminApi;