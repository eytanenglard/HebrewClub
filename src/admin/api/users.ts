// File: src/api/admin/users.ts
import api from './index';
import { User, UserData, PaginatedResponse, ApiResponse } from '../types/models';
import { LOG_PREFIX } from './index';

export const fetchUsers = async (page: number = 1, limit: number = 10, search?: string): Promise<ApiResponse<PaginatedResponse<User[]>>> => {
  console.log(`${LOG_PREFIX} Fetching users`);
  try {
    const response = await api.get<ApiResponse<PaginatedResponse<User[]>>>('/admin/users', { params: { page, limit, search } });
    console.log(`${LOG_PREFIX} Fetched users response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error fetching users:`, error);
    throw error;
  }
};

export const createUser = async (userData: UserData): Promise<ApiResponse<User>> => {
  console.log(`${LOG_PREFIX} Creating user`, userData);
  try {
    const response = await api.post<ApiResponse<User>>('/admin/users', userData);
    console.log(`${LOG_PREFIX} User creation successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} User creation failed:`, error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<UserData>): Promise<ApiResponse<User>> => {
  console.log(`${LOG_PREFIX} Updating user`, userId, userData);
  try {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${userId}`, userData);
    console.log(`${LOG_PREFIX} User update successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} User update failed:`, error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<ApiResponse<void>> => {
  console.log(`${LOG_PREFIX} Deleting user`, userId);
  try {
    const response = await api.delete<ApiResponse<void>>(`/admin/users/${userId}`);
    console.log(`${LOG_PREFIX} User deletion successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} User deletion failed:`, error);
    throw error;
  }
};

export const addCourseToUser = async (userId: string, courseId: string): Promise<ApiResponse<User>> => {
  console.log(`${LOG_PREFIX} Adding course to user`, userId, courseId);
  try {
    const response = await api.post<ApiResponse<User>>(`/admin/users/${userId}/courses`, { courseId });
    console.log(`${LOG_PREFIX} Course added to user successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to add course to user:`, error);
    throw error;
  }
};

export const removeCourseFromUser = async (userId: string, courseId: string): Promise<ApiResponse<User>> => {
  console.log(`${LOG_PREFIX} Removing course from user`, userId, courseId);
  try {
    const response = await api.delete<ApiResponse<User>>(`/admin/users/${userId}/courses/${courseId}`);
    console.log(`${LOG_PREFIX} Course removed from user successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to remove course from user:`, error);
    throw error;
  }
};