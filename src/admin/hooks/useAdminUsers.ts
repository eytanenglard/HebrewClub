import { useState } from 'react';
import { message } from 'antd';
import { fetchUsers, createUser, updateUser, deleteUser, addCourseToUser, removeCourseFromUser } from '../api/users';
import { User, UserData, PaginatedResponse } from '../types/models';

export const useAdminUsers = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchUsers = async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<User[]>> => {
    setLoading(true);
    try {
      const response = await fetchUsers(page, limit, search);
      return response.data;
    } catch (error) {
      console.error('Fetch users error:', error);
      message.error('Failed to fetch users');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: UserData): Promise<User> => {
    setLoading(true);
    try {
      console.log("userData--", {userData});
      const response = await createUser(userData);
      message.success('User created successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Create user error:', error);
      message.error('Failed to create user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: string, userData: Partial<UserData>): Promise<User> => {
    setLoading(true);
    try {
      const response = await updateUser(id, userData);
      message.success('User updated successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Update user error:', error);
      message.error('Failed to update user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteUser(id);
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Delete user error:', error);
      message.error('Failed to delete user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourseToUser = async (userId: string, courseId: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await addCourseToUser(userId, courseId);
      message.success('Course added to user successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Add course to user error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to add course to user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourseFromUser = async (userId: string, courseId: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await removeCourseFromUser(userId, courseId);
      message.success('Course removed from user successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Remove course from user error:', error);
      message.error('Failed to remove course from user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchUsers: handleFetchUsers,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    addCourseToUser: handleAddCourseToUser,
    removeCourseFromUser: handleRemoveCourseFromUser
  };
};

export default useAdminUsers;