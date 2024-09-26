import { useState } from 'react';
import { message } from 'antd';
import { getCourseManagementData, createCourse, updateCourse, deleteCourse, addUserToCourse, removeUserFromCourse } from '../api/courses';
import { Course, CourseData, ApiResponse, PaginatedResponse } from '../types/models';

export const useAdminCourses = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchCourses = async (): Promise<PaginatedResponse<Course[]>> => {
    setLoading(true);
    try {
      const response: ApiResponse<PaginatedResponse<Course[]>> = await getCourseManagementData();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Fetch courses error:', error);
      message.error('Failed to fetch courses');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: CourseData): Promise<Course> => {
    setLoading(true);
    try {
      const response = await createCourse(courseData);
      if (response.success && response.data) {
        message.success('Course created successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Create course error:', error);
      message.error('Failed to create course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (id: string, courseData: Partial<CourseData>): Promise<Course> => {
    setLoading(true);
    try {
      const response = await updateCourse(id, courseData);
      if (response.success && response.data) {
        message.success('Course updated successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Update course error:', error);
      message.error('Failed to update course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await deleteCourse(id);
      if (response.success) {
        message.success('Course deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Delete course error:', error);
      message.error('Failed to delete course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserToCourse = async (courseId: string, userId: string): Promise<Course> => {
    setLoading(true);
    try {
      const response = await addUserToCourse(courseId, userId);
      if (response.success && response.data) {
        message.success('User added to course successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to add user to course');
      }
    } catch (error) {
      console.error('Add user to course error:', error);
      message.error('Failed to add user to course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUserFromCourse = async (courseId: string, userId: string): Promise<Course> => {
    setLoading(true);
    try {
      const response = await removeUserFromCourse(courseId, userId);
      if (response.success && response.data) {
        message.success('User removed from course successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to remove user from course');
      }
    } catch (error) {
      console.error('Remove user from course error:', error);
      message.error('Failed to remove user from course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchCourses: handleFetchCourses,
    createCourse: handleCreateCourse,
    updateCourse: handleUpdateCourse,
    deleteCourse: handleDeleteCourse,
    addUserToCourse: handleAddUserToCourse,
    removeUserFromCourse: handleRemoveUserFromCourse
  };
};

export default useAdminCourses;