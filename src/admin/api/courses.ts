import adminApi from './index';
import { AxiosResponse } from 'axios';
import { 
  Course, 
  CourseData, 
  Section, 
  SectionData, 
  Lesson, 
  LessonData, 
  ContentItem, 
  ContentItemData, 
  ApiResponse, 
  PaginatedResponse,
  PopulatedCourse,
  User
} from '../types/models';
import { LOG_PREFIX } from './index';

// Course management
export const getCourseManagementData = (): Promise<AxiosResponse<PaginatedResponse<Course[]>>> => {
  console.log(`${LOG_PREFIX} Fetching course management data`);
  return adminApi.get('/admin/course-content/courses');
};

export const createCourse = (courseData: CourseData): Promise<AxiosResponse<ApiResponse<Course>>> => {
  console.log(`${LOG_PREFIX} Creating course`, courseData);
  return adminApi.post('/admin/course-content/courses', courseData);
};

export const updateCourse = (courseId: string, courseData: Partial<CourseData>): Promise<AxiosResponse<ApiResponse<Course>>> => {
  console.log(`${LOG_PREFIX} Updating course`, courseId, courseData);
  return adminApi.put(`/admin/course-content/courses/${courseId}`, courseData);
};

export const deleteCourse = (courseId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
  console.log(`${LOG_PREFIX} Deleting course`, courseId);
  return adminApi.delete(`/admin/course-content/courses/${courseId}`);
};

// User-course association
export const addUserToCourse = (courseId: string, userId: string): Promise<AxiosResponse<ApiResponse<Course>>> => {
  console.log(`${LOG_PREFIX} Adding user to course`, courseId, userId);
  return adminApi.post(`/admin/course-content/courses/${courseId}/users`, { userId });
};

export const removeUserFromCourse = (courseId: string, userId: string): Promise<AxiosResponse<ApiResponse<Course>>> => {
  console.log(`${LOG_PREFIX} Removing user from course`, courseId, userId);
  return adminApi.delete(`/admin/course-content/courses/${courseId}/users/${userId}`);
};

// Section management
export const createSection = (courseId: string, sectionData: SectionData): Promise<AxiosResponse<ApiResponse<Section>>> => {
  console.log(`${LOG_PREFIX} Creating section`, courseId, sectionData);
  return adminApi.post(`/admin/course-content/courses/${courseId}/sections`, sectionData);
};

export const updateSection = (sectionId: string, sectionData: Partial<SectionData>): Promise<AxiosResponse<ApiResponse<Section>>> => {
  console.log(`${LOG_PREFIX} Updating section`, sectionId, sectionData);
  return adminApi.put(`/admin/course-content/sections/${sectionId}`, sectionData);
};

export const deleteSection = (sectionId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
  console.log(`${LOG_PREFIX} Deleting section`, sectionId);
  return adminApi.delete(`/admin/course-content/sections/${sectionId}`);
};

// Lesson management
export const createLesson = (sectionId: string, lessonData: LessonData): Promise<AxiosResponse<ApiResponse<Lesson>>> => {
  console.log(`${LOG_PREFIX} Creating lesson`, sectionId, lessonData);
  return adminApi.post(`/admin/course-content/sections/${sectionId}/lessons`, lessonData);
};

export const updateLesson = (lessonId: string, lessonData: Partial<LessonData>): Promise<AxiosResponse<ApiResponse<Lesson>>> => {
  console.log(`${LOG_PREFIX} Updating lesson`, lessonId, lessonData);
  return adminApi.put(`/admin/course-content/lessons/${lessonId}`, lessonData);
};

export const deleteLesson = (lessonId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
  console.log(`${LOG_PREFIX} Deleting lesson`, lessonId);
  return adminApi.delete(`/admin/course-content/lessons/${lessonId}`);
};

// Content management
export const addContent = (lessonId: string, contentData: ContentItemData): Promise<AxiosResponse<ApiResponse<ContentItem>>> => {
  console.log(`${LOG_PREFIX} Adding content`, lessonId, contentData);
  return adminApi.post(`/admin/course-content/lessons/${lessonId}/content`, contentData);
};

export const updateContent = (contentId: string, contentData: Partial<ContentItemData>): Promise<AxiosResponse<ApiResponse<ContentItem>>> => {
  console.log(`${LOG_PREFIX} Updating content`, contentId, contentData);
  return adminApi.put(`/admin/course-content/content/${contentId}`, contentData);
};

export const deleteContent = (contentId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
  console.log(`${LOG_PREFIX} Deleting content`, contentId);
  return adminApi.delete(`/admin/course-content/content/${contentId}`);
};

// Fetch course content
export const fetchCourseContent = async (courseId: string): Promise<ApiResponse<PopulatedCourse>> => {
  console.log(`${LOG_PREFIX} Attempting to fetch course content for courseId: ${courseId}`);
  try {
    const response = await adminApi.get<ApiResponse<PopulatedCourse>>(`/admin/course-content/courses/${courseId}/content`);
    console.log(`${LOG_PREFIX} Received response for course content:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Fetch course content error:`, error);
    throw error;
  }
};

// Update course structure
export const updateCourseStructure = (courseId: string, updatedCourse: Course): Promise<AxiosResponse<ApiResponse<Course>>> => {
  console.log(`${LOG_PREFIX} Updating course structure`, courseId, updatedCourse);
  return adminApi.put(`/admin/course-content/courses/${courseId}/structure`, updatedCourse);
};

// New functions
export const fetchSections = (courseId: string): Promise<AxiosResponse<ApiResponse<Section[]>>> => {
  console.log(`${LOG_PREFIX} Fetching sections for course`, courseId);
  return adminApi.get(`/admin/course-content/courses/${courseId}/sections`);
};

export const fetchLessons = async (sectionIds: string[]): Promise<ApiResponse<Lesson[]>> => {
  console.log(`${LOG_PREFIX} Fetching lessons for sections`, sectionIds);
  const response = await adminApi.get('/admin/course-content/lessons', { params: { sectionIds } });
  return response.data;
};


export const fetchContentItems = async (contentItemIds: string[]): Promise<ApiResponse<ContentItem[]>> => {
  console.log(`${LOG_PREFIX} Fetching content items for IDs:`, contentItemIds);
  const response = await adminApi.get('/admin/course-content/content', { 
    params: { ids: contentItemIds.join(',') }
  });
  return response.data;
};
export const fetchInstructors = (): Promise<AxiosResponse<ApiResponse<User[]>>> => {
  console.log(`${LOG_PREFIX} Fetching instructors`);
  return adminApi.get('/admin/course-content/courses/instructors');
};

export const fetchUsersCourse = (): Promise<AxiosResponse<ApiResponse<User[]>>> => {
  console.log(`${LOG_PREFIX} Fetching users for course`);
  return adminApi.get('/admin/course-content/courses/users');
};

// New functions to match courseContentRoutes.ts
export const getLesson = (lessonId: string): Promise<AxiosResponse<ApiResponse<Lesson>>> => {
  console.log(`${LOG_PREFIX} Fetching lesson`, lessonId);
  return adminApi.get(`/admin/course-content/lessons/${lessonId}`);
};

export const getSection = (sectionId: string): Promise<AxiosResponse<ApiResponse<Section>>> => {
  console.log(`${LOG_PREFIX} Fetching section`, sectionId);
  return adminApi.get(`/admin/course-content/sections/${sectionId}`);
};

export const getSections = (courseId: string): Promise<AxiosResponse<ApiResponse<Section[]>>> => {
  console.log(`${LOG_PREFIX} Fetching sections for course`, courseId);
  return adminApi.get(`/admin/course-content/courses/${courseId}/sections`);
};