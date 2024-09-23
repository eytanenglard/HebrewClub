// File: src/api/admin/users.ts
import adminApi from './index';
import { AxiosResponse } from 'axios';
import { User, UserData, UserProfile, UserStats, UserActivity, PaginatedResponse, ApiResponse } from '../types/models';
import { LOG_PREFIX } from './index';

export const fetchUsers = (page: number = 1, limit: number = 10, search?: string): Promise<AxiosResponse<PaginatedResponse<User[]>>> => {
  console.log(`${LOG_PREFIX} Fetching users`);
  return adminApi.get('/admin/users', { params: { page, limit, search } });
};

export const createUser = (userData: UserData): Promise<AxiosResponse<ApiResponse<User>>> => {
  console.log(`${LOG_PREFIX} Creating user`, userData);
  return adminApi.post('/admin/users', userData);
};

export const updateUser = (userId: string, userData: Partial<UserData>): Promise<AxiosResponse<ApiResponse<User>>> => {
  console.log(`${LOG_PREFIX} Updating user`, userId, userData);
  return adminApi.put(`/admin/users/${userId}`, userData);
};

export const deleteUser = (userId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
  console.log(`${LOG_PREFIX} Deleting user`, userId);
  return adminApi.delete(`/admin/users/${userId}`);
};

export const addCourseToUser = (userId: string, courseId: string): Promise<AxiosResponse<ApiResponse<User>>> => {
  console.log(`${LOG_PREFIX} Adding course to user`, userId, courseId);
  return adminApi.post(`/admin/users/${userId}/courses`, { courseId });
};

export const removeCourseFromUser = (userId: string, courseId: string): Promise<AxiosResponse<ApiResponse<User>>> => {
  console.log(`${LOG_PREFIX} Removing course from user`, userId, courseId);
  return adminApi.delete(`/admin/users/${userId}/courses/${courseId}`);
};

// Export other functions as needed