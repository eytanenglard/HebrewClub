import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ensureCsrfToken } from './auth';
import { Course, UserProfile, UserResponse, ApiResponse, PopulatedCoursefull } from '../admin/types/models';

const LOG_PREFIX = '[personalAreaapiService.ts]';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
console.log(`${LOG_PREFIX} API_BASE_URL:`, API_BASE_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  console.log(`${LOG_PREFIX} Sending ${config.method} request to: ${config.url}`);
  console.log(`${LOG_PREFIX} Request headers:`, config.headers);
  console.log(`${LOG_PREFIX} Request data:`, config.data);

  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const csrfToken = await ensureCsrfToken();
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
    console.log(`${LOG_PREFIX} Added CSRF token to request`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`${LOG_PREFIX} Response received:`, response.status, response.data);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(`${LOG_PREFIX} API Error:`, error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.error(`${LOG_PREFIX} Unauthorized:`, error.response.data);
        // Handle unauthorized access (e.g., redirect to login page)
      }
    } else if (error.request) {
      console.error(`${LOG_PREFIX} No response received:`, error.request);
    } else {
      console.error(`${LOG_PREFIX} Error setting up request:`, error.message);
    }
    return Promise.reject(error);
  }
);

const handleApiCall = async <T>(apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> => {
  try {
    console.log(`${LOG_PREFIX} Making API call...`);
    const response = await apiCall();
    console.log(`${LOG_PREFIX} API call successful:`, response.data);
    
    if (response.data && typeof response.data === 'object') {
      if ('success' in response.data && 'data' in response.data) {
        if (response.data.success) {
          return response.data.data as T;
        } else {
          throw new Error(response.data.error || 'API call failed');
        }
      } else {
        return response.data as T;
      }
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} API call failed:`, error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<T>>;
      console.error(`${LOG_PREFIX} Error details:`, axiosError.response?.data);
      console.error(`${LOG_PREFIX} Error status:`, axiosError.response?.status);
      console.error(`${LOG_PREFIX} Error headers:`, axiosError.response?.headers);
    }
    throw error;
  }
};

export const fetchCourses = async (userId: string): Promise<Course[]> => {
  console.log(`${LOG_PREFIX} Fetching courses for user ID: ${userId}`);
  return handleApiCall(() => api.get<ApiResponse<Course[]>>(`/api/personal-area/courses?userId=${userId}`));
};

export const fetchCourseFromServer = async (courseId: string): Promise<PopulatedCoursefull> => {
  console.log(`${LOG_PREFIX} Attempting to fetch course content for courseId: ${courseId}`);
  return handleApiCall(() => api.get<ApiResponse<PopulatedCoursefull>>(`/admin/course-content/courses/${courseId}/content`));
};
const apiService = {
  getUserProfile: () => handleApiCall(() => api.get<ApiResponse<UserResponse>>('/api/personal-area/profile')),
  updateUserProfile: (profileData: Partial<UserProfile>) => handleApiCall(() => api.put<ApiResponse<UserResponse>>('/api/personal-area/profile', profileData)),
  updateUserPassword: (currentPassword: string, newPassword: string) => 
    handleApiCall(() => api.put<ApiResponse<void>>('/api/personal-area/change-password', { currentPassword, newPassword })),
  deleteUserAccount: () => handleApiCall(() => api.delete<ApiResponse<void>>('/api/personal-area/account')),
};

export const useApi = () => {
  return {
    ...apiService,
    fetchCourses,
    fetchCourseFromServer,
  };
};

export default useApi;