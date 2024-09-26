// File: src/api/admin/index.ts
import api from '../../services/api';

export const LOG_PREFIX = '[adminApi]';

// Interceptors for logging
api.interceptors.request.use(
  (config) => {
    console.log(`${LOG_PREFIX} Outgoing request:`, config.method, config.url, JSON.stringify(config.data, null, 2));
    return config;
  },
  (error) => {
    console.error(`${LOG_PREFIX} Request error:`, error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`${LOG_PREFIX} Incoming response:`, response.status, JSON.stringify(response, null, 2));
    return response;
  },
  (error) => {
    console.error(`${LOG_PREFIX} Response error:`, error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      console.error(`${LOG_PREFIX} Unauthorized:`, error.response.data);
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export * from './auth';
export * from './users';
export * from './courses';
export * from './leads';

export default api;