import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig, CanceledError } from 'axios';
import { ensureCsrfToken } from './auth';
import { LoginResponse, User} from '../admin/types/models';
import {Lead, Course, LeadData, ApiResponse} from '../admin/types/models';

const LOG_PREFIX = '[api.ts]';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(`${LOG_PREFIX} API_BASE_URL:`, API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const protectedRoutes = ['/api/user', '/api/courses', '/auth/checkAuth', '/auth/current-user', '/auth/refresh-token', 'api/leads'];

api.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  console.log(`${LOG_PREFIX} Sending ${config.method} request to: ${config.url}`);
  
  console.log(`${LOG_PREFIX} Request headers:`, config.headers);
  console.log(`${LOG_PREFIX} Request data:`, config.data);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (config.url && protectedRoutes.some(route => config.url!.includes(route))) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
      console.log(`${LOG_PREFIX} Added CSRF token to request`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) {
      console.log(`${LOG_PREFIX} Request canceled:`, (error as CanceledError<unknown>).message);
      return Promise.reject(error);
    }
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error(`${LOG_PREFIX} API Error:`, axiosError.response.status, axiosError.response.data);
        if (axiosError.response.status === 401) {
          console.error(`${LOG_PREFIX} Unauthorized:`, axiosError.response.data);
          // Remove this line to prevent automatic redirection
          // window.location.href = '/auth/login';
          return Promise.reject(error);
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
export const fetchAllCourses = async (): Promise<Course[]> => {
  console.log(`${LOG_PREFIX} Fetching all courses`);
  try {
    const csrfToken = await ensureCsrfToken();
    const response = await api.get<{ success: boolean, data: Course[] }>('/api/course-enrollments/courses/all', {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    console.log(`${LOG_PREFIX} All courses fetch successful:`, response.data);
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch all courses:`, error);
    throw error;
  }
};
export const enrollInCourse = async (enrollmentData: LeadData): Promise<ApiResponse<Lead>> => {
  console.log(`${LOG_PREFIX} Enrolling user in course`);
  try {
    const response = await api.post<ApiResponse<Lead>>('/api/course-enrollments', enrollmentData);
    console.log(`${LOG_PREFIX} Lead enrollment successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Lead enrollment failed:`, error);
    throw error;
  }
};
export const fetchEnrollmentDetails = async (leadId: string): Promise<ApiResponse<Lead>> => {
  console.log(`${LOG_PREFIX} Fetching enrollment details for lead ID:`, leadId);
  try {
    const csrfToken = await ensureCsrfToken();
    const response = await api.get<ApiResponse<Lead>>(`/api/course-enrollments/${leadId}`, {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    console.log(`${LOG_PREFIX} Enrollment details fetch successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Enrollment details fetch failed:`, error);
    throw error;
  }
};
export const fetchCourseDetails = async (courseId: string): Promise<ApiResponse<Course>> => {
  console.log(`${LOG_PREFIX} Fetching course details for course ID:`, courseId);
  try {
    const csrfToken = await ensureCsrfToken();
    const response = await api.get<ApiResponse<Course>>(`/api/course-enrollments/courses/${courseId}`, {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    console.log(`${LOG_PREFIX} Course details fetch successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch course details:`, error);
    throw error;
  }
};

export const associateCourseWithUser = async (userId: string, courseId: string): Promise<void> => {
  console.log(`${LOG_PREFIX} Associating course ${courseId} with user ${userId}`);
  try {
    const csrfToken = await ensureCsrfToken();
    await api.post('/api/course-enrollments/associate-course', { userId, courseId }, {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    console.log(`${LOG_PREFIX} Course association successful`);
  } catch (error) {
    console.error(`${LOG_PREFIX} Error associating course with user:`, error);
    throw error;
  }
};
export const updateLead = async (leadId: string, updateData: Partial<Lead>): Promise<ApiResponse<Lead>> => {
  console.log(`${LOG_PREFIX} Updating lead with ID:`, leadId);
  try {
    const csrfToken = await ensureCsrfToken();
    const response = await api.put<ApiResponse<Lead>>(`/api/course-enrollments/${leadId}`, updateData, {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    console.log(`${LOG_PREFIX} Lead update successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Lead update failed:`, error);
    throw error;
  }
};
export const handleDevToolsLogin = async (): Promise<void> => {
  console.log(`${LOG_PREFIX} Handling DevTools GET request to /auth/login`);
  try {
    await api.get('/auth/login');
    console.log(`${LOG_PREFIX} DevTools login request handled successfully`);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log(`${LOG_PREFIX} DevTools login request was canceled as expected`);
    } else {
      console.error(`${LOG_PREFIX} Error handling DevTools login request:`, error);
    }
  }
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  console.log(`${LOG_PREFIX} Attempting login for user:`, username);
  try {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    console.log(`${LOG_PREFIX} Login successful for user:`, username);
    console.log(`${LOG_PREFIX} Response data:`, response.data);

    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Login failed for user:`, username, error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 405) {
        return {
          success: false,
          token: null,
          user: null,
          error: 'Unexpected login request. Please try again.'
        };
      }
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  console.log(`${LOG_PREFIX} Attempting to log out user`);
  try {
    await api.post('/auth/logout');
    console.log(`${LOG_PREFIX} Logout successful`);
    localStorage.removeItem('token');
  } catch (error) {
    console.error(`${LOG_PREFIX} Logout failed:`, error);
  }
};

export const register = async (userData: Partial<User>): Promise<LoginResponse> => {
  console.log(`${LOG_PREFIX} Attempting to register new user`, userData);
  try {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    console.log(`${LOG_PREFIX} User registration successful`, response.data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} User registration failed:`, error);
    throw error;
  }
};

export const checkAuth = async (): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Checking authentication status`);
  try {
    const response = await api.get<{ isAuthenticated: boolean }>('/auth/checkAuth');
    console.log(`${LOG_PREFIX} Authentication check result:`, response.data.isAuthenticated);
    return response.data.isAuthenticated;
  } catch (error) {
    console.log(`${LOG_PREFIX} User is not authenticated`);
    return false;
  }
};

export const createLead = async (leadData: Partial<Lead>): Promise<Lead> => {
  console.log(`${LOG_PREFIX} Creating new lead`);
  try {
    const response = await api.post<Lead>('/api/leads', leadData);
    console.log(`${LOG_PREFIX} Lead creation successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Lead creation failed:`, error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  console.log(`${LOG_PREFIX} Fetching current user`);
  try {
    const response = await api.get<ApiResponse<User>>('/auth/current-user');
    if (response.data.success) {  
    console.log(`${LOG_PREFIX} Current user fetch successful:`, response.data);
    return response.data.data;
    }
    else{
    console.log(`${LOG_PREFIX} No user found`, response.data);
    return response.data.data; 
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} Current user fetch failed:`, error);
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Verifying token`);
  try {
    const response = await api.post<{ isValid: boolean }>('/auth/verify-token', { token });
    return response.data.isValid;
  } catch (error) {
    console.error(`${LOG_PREFIX} Token verification failed:`, error);
    return false;
  }
};
export const verifyEmail = async (token: string): Promise<ApiResponse<User>> => {
  console.log(`${LOG_PREFIX} Verifying email with token`);
  try {
    const response = await api.post<ApiResponse<User>>('/auth/verify-email', { token });
    console.log(`${LOG_PREFIX} Email verification successful:`, response.data);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log(`${LOG_PREFIX} Token saved to localStorage after email verification`);
    }
    return {
      success: response.data.success,
      data: response.data.user ?? {} as User,
      message: response.data.message,
      token: response.data.token,
      user: response.data.user,
      error: response.data.error
    };
  } catch (error) {
    console.error(`${LOG_PREFIX} Email verification failed:`, error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        data: {} as User,
        message: '',
        token: null,
        user: null,
        error: error.response.data.error || 'An error occurred during email verification'
      };
    }
    throw error;
  }
};
export const resendVerificationEmail = async (email: string): Promise<ApiResponse<null>> => {
  console.log(`${LOG_PREFIX} Resending verification email for:`, email);
  try {
    const response = await api.post<ApiResponse<null>>('/auth/resend-verification', { email });
    console.log(`${LOG_PREFIX} Verification email resent successfully`);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to resend verification email:`, error);
    throw error;
  }
};
export const forgotPassword = async (email: string): Promise<ApiResponse<null>> => {
  console.log(`${LOG_PREFIX} Initiating forgot password for email:`, email);
  try {
    const response = await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
    console.log(`${LOG_PREFIX} Forgot password request successful`);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Forgot password request failed:`, error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
  console.log(`${LOG_PREFIX} Resetting password with token`);
  try {
    const response = await api.post<ApiResponse<null>>('/auth/reset-password', { token, newPassword });
    console.log(`${LOG_PREFIX} Password reset successful`);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Password reset failed:`, error);
    throw error;
  }
};

export default api;
