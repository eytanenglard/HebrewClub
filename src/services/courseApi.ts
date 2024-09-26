import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ensureCsrfToken } from './auth';
import { Course, ApiResponse, PopulatedCoursefull, Lesson} from '../admin/types/models';

const LOG_PREFIX = '[courseApi.ts]';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(`${LOG_PREFIX} API_BASE_URL:`, API_BASE_URL);

const api: AxiosInstance = axios.create({
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

  const csrfToken = await ensureCsrfToken();
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
    console.log(`${LOG_PREFIX} Added CSRF token to request`);
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
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

export const fetchCourses = async (userId: string): Promise<ApiResponse<Course[]>> => {
  console.log(`${LOG_PREFIX} Fetching courses for user ID: ${userId}`);
  try {
    const response = await api.get<ApiResponse<Course[]>>(`/api/personal-area/courses?userId=${userId}`);
    console.log(`${LOG_PREFIX} Fetched courses response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error fetching courses:`, error);
    throw error;
  }
};

export const fetchCourseFromServer = async (courseId: string): Promise<ApiResponse<PopulatedCoursefull>> => {
  console.log(`${LOG_PREFIX} Fetching course with ID: ${courseId}`);
  try {
    const response = await api.get<ApiResponse<PopulatedCoursefull>>(`/api/personal-area/courses/${courseId}`);
    console.log(`${LOG_PREFIX} Course fetch successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch course:`, error);
    throw error;
  }
};

export const enrollInCourse = async (courseId: string, userId: string): Promise<ApiResponse<Course>> => {
  console.log(`${LOG_PREFIX} Enrolling user ${userId} in course ${courseId}`);
  try {
    const response = await api.post<ApiResponse<Course>>('/api/personal-area/enroll', { courseId, userId });
    console.log(`${LOG_PREFIX} Enrollment successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Enrollment failed:`, error);
    throw error;
  }
};

export const fetchLessons = async (courseId: string): Promise<ApiResponse<Lesson[]>> => {
  console.log(`${LOG_PREFIX} Fetching lessons for course ID: ${courseId}`);
  try {
    const response = await api.get<ApiResponse<Lesson[]>>(`/api/personal-area/courses/${courseId}/lessons`);
    console.log(`${LOG_PREFIX} Fetched lessons response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error fetching lessons:`, error);
    throw error;
  }
};

export const fetchLesson = async (courseId: string, lessonId: string): Promise<ApiResponse<Lesson>> => {
  console.log(`${LOG_PREFIX} Fetching lesson ${lessonId} for course ${courseId}`);
  try {
    const response = await api.get<ApiResponse<Lesson>>(`/api/personal-area/courses/${courseId}/lessons/${lessonId}`);
    console.log(`${LOG_PREFIX} Fetched lesson response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error fetching lesson:`, error);
    throw error;
  }
};


export default api;