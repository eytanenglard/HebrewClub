import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ensureCsrfToken } from './auth';
import { Course} from '../types/models';

const LOG_PREFIX = '[courseApi.ts]';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(`${LOG_PREFIX} API_BASE_URL:`, API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  console.log(`${LOG_PREFIX} Sending ${config.method} request to: ${config.url}`);
  
  console.log(`${LOG_PREFIX} Request headers:`, config.headers);
  console.log(`${LOG_PREFIX} Request data:`, config.data);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Add CSRF token to all requests
  const csrfToken = await ensureCsrfToken();
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
    console.log(`${LOG_PREFIX} Added CSRF token to request`);
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error(`${LOG_PREFIX} API Error:`, axiosError.response.status, axiosError.response.data);
        if (axiosError.response.status === 401) {
          console.error(`${LOG_PREFIX} Unauthorized:`, axiosError.response.data);
          // Handle unauthorized access (e.g., redirect to login page)
        }
      } else if (axiosError.request) {
        console.error(`${LOG_PREFIX} No response received:`, axiosError.request);
      } else {
        console.error(`${LOG_PREFIX} Error setting up request:`, axiosError.message);
      }
    } else {
      console.error(`${LOG_PREFIX} Non-Axios error:`, error);
    }
    return Promise.reject(error);
  }
);

export const fetchCourses = async (userId: string): Promise<Course[]> => {
  console.log(`${LOG_PREFIX} Fetching courses for user ID: ${userId}`);
  try {
    const response = await api.get<{ success: boolean, data: Course[] }>(`/api/personal-area/courses?userId=${userId}`);
    console.log(`${LOG_PREFIX} Fetched courses response:`, response.data);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch courses');
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} Error fetching courses:`, error);
    throw error;
  }
};

export const fetchCourseFromServer = async (courseId: string): Promise<{ success: boolean; data?: Course; message: string }> => {
  console.log(`${LOG_PREFIX} Fetching course with ID: ${courseId}`);
  try {
    const response = await api.get<{ success: boolean; data: Course; message: string }>(`/api/personal-area/courses/${courseId}`);
    console.log(`${LOG_PREFIX} Course fetch successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch course:`, error);
    throw error;
  }
};
// Add more API functions as needed, e.g., for lessons and bookmarks

export default api;