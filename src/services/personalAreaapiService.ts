import api from './api';
import { Course, UserProfile, UserResponse, ApiResponse, PopulatedCoursefull } from '../admin/types/models';
import { AxiosResponse } from 'axios';

const LOG_PREFIX = '[personalAreaapiService.ts]';

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