import api from './api';
import { Course, ApiResponse, PopulatedCoursefull, Lesson } from '../admin/types/models';

const LOG_PREFIX = '[courseApi.ts]';

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

export default {
  fetchCourses,
  fetchCourseFromServer,
  enrollInCourse,
  fetchLessons,
  fetchLesson
};