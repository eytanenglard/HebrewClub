// File: src/api/admin/courses.ts
import api from './index';
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
export const getCourseManagementData = async (): Promise<ApiResponse<PaginatedResponse<Course[]>>> => {
  console.log(`${LOG_PREFIX} Fetching course management data`);
  try {
    const response = await api.get<ApiResponse<PaginatedResponse<Course[]>>>('/admin/course-content/courses');
    console.log(`${LOG_PREFIX} Course management data fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch course management data:`, error);
    throw error;
  }
};

export const createCourse = async (courseData: CourseData): Promise<ApiResponse<Course>> => {
  console.log(`${LOG_PREFIX} Creating course`, courseData);
  try {
    const response = await api.post<ApiResponse<Course>>('/admin/course-content/courses', courseData);
    console.log(`${LOG_PREFIX} Course created successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to create course:`, error);
    throw error;
  }
};

export const updateCourse = async (courseId: string, courseData: Partial<CourseData>): Promise<ApiResponse<Course>> => {
  console.log(`${LOG_PREFIX} Updating course`, courseId, courseData);
  try {
    const response = await api.put<ApiResponse<Course>>(`/admin/course-content/courses/${courseId}`, courseData);
    console.log(`${LOG_PREFIX} Course updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to update course:`, error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string): Promise<ApiResponse<void>> => {
  console.log(`${LOG_PREFIX} Deleting course`, courseId);
  try {
    const response = await api.delete<ApiResponse<void>>(`/admin/course-content/courses/${courseId}`);
    console.log(`${LOG_PREFIX} Course deleted successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to delete course:`, error);
    throw error;
  }
};

// User-course association
export const addUserToCourse = async (courseId: string, userId: string): Promise<ApiResponse<Course>> => {
  console.log(`${LOG_PREFIX} Adding user to course`, courseId, userId);
  try {
    const response = await api.post<ApiResponse<Course>>(`/admin/course-content/courses/${courseId}/users`, { userId });
    console.log(`${LOG_PREFIX} User added to course successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to add user to course:`, error);
    throw error;
  }
};

export const removeUserFromCourse = async (courseId: string, userId: string): Promise<ApiResponse<Course>> => {
  console.log(`${LOG_PREFIX} Removing user from course`, courseId, userId);
  try {
    const response = await api.delete<ApiResponse<Course>>(`/admin/course-content/courses/${courseId}/users/${userId}`);
    console.log(`${LOG_PREFIX} User removed from course successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to remove user from course:`, error);
    throw error;
  }
};

// Section management
export const createSection = async (courseId: string, sectionData: SectionData): Promise<ApiResponse<Section>> => {
  console.log(`${LOG_PREFIX} Creating section`, courseId, sectionData);
  try {
    const response = await api.post<ApiResponse<Section>>(`/admin/course-content/courses/${courseId}/sections`, sectionData);
    console.log(`${LOG_PREFIX} Section created successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to create section:`, error);
    throw error;
  }
};

export const updateSection = async (sectionId: string, sectionData: Partial<SectionData>): Promise<ApiResponse<Section>> => {
  console.log(`${LOG_PREFIX} Updating section`, sectionId, sectionData);
  try {
    const response = await api.put<ApiResponse<Section>>(`/admin/course-content/sections/${sectionId}`, sectionData);
    console.log(`${LOG_PREFIX} Section updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to update section:`, error);
    throw error;
  }
};

export const deleteSection = async (sectionId: string): Promise<ApiResponse<void>> => {
  console.log(`${LOG_PREFIX} Deleting section`, sectionId);
  try {
    const response = await api.delete<ApiResponse<void>>(`/admin/course-content/sections/${sectionId}`);
    console.log(`${LOG_PREFIX} Section deleted successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to delete section:`, error);
    throw error;
  }
};

// Lesson management
export const createLesson = async (sectionId: string, lessonData: LessonData): Promise<ApiResponse<Lesson>> => {
  console.log(`${LOG_PREFIX} Creating lesson`, sectionId, lessonData);
  try {
    const response = await api.post<ApiResponse<Lesson>>(`/admin/course-content/sections/${sectionId}/lessons`, lessonData);
    console.log(`${LOG_PREFIX} Lesson created successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to create lesson:`, error);
    throw error;
  }
};

export const updateLesson = async (lessonId: string, lessonData: Partial<LessonData>): Promise<ApiResponse<Lesson>> => {
  console.log(`${LOG_PREFIX} Updating lesson`, lessonId, lessonData);
  try {
    const response = await api.put<ApiResponse<Lesson>>(`/admin/course-content/lessons/${lessonId}`, lessonData);
    console.log(`${LOG_PREFIX} Lesson updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to update lesson:`, error);
    throw error;
  }
};

export const deleteLesson = async (lessonId: string): Promise<ApiResponse<void>> => {
  console.log(`${LOG_PREFIX} Deleting lesson`, lessonId);
  try {
    const response = await api.delete<ApiResponse<void>>(`/admin/course-content/lessons/${lessonId}`);
    console.log(`${LOG_PREFIX} Lesson deleted successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to delete lesson:`, error);
    throw error;
  }
};

// Content management
export const addContent = async (lessonId: string, contentData: ContentItemData): Promise<ApiResponse<ContentItem>> => {
  console.log(`${LOG_PREFIX} Adding content`, lessonId, contentData);
  try {
    const response = await api.post<ApiResponse<ContentItem>>(`/admin/course-content/lessons/${lessonId}/content`, contentData);
    console.log(`${LOG_PREFIX} Content added successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to add content:`, error);
    throw error;
  }
};

export const updateContent = async (contentId: string, contentData: Partial<ContentItemData>): Promise<ApiResponse<ContentItem>> => {
  console.log(`${LOG_PREFIX} Updating content`, contentId, contentData);
  try {
    const response = await api.put<ApiResponse<ContentItem>>(`/admin/course-content/content/${contentId}`, contentData);
    console.log(`${LOG_PREFIX} Content updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to update content:`, error);
    throw error;
  }
};

export const deleteContent = async (contentId: string): Promise<ApiResponse<void>> => {
  console.log(`${LOG_PREFIX} Deleting content`, contentId);
  try {
    const response = await api.delete<ApiResponse<void>>(`/admin/course-content/content/${contentId}`);
    console.log(`${LOG_PREFIX} Content deleted successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to delete content:`, error);
    throw error;
  }
};

// Fetch course content (continued)
export const fetchCourseContent = async (courseId: string): Promise<ApiResponse<PopulatedCourse>> => {
  console.log(`${LOG_PREFIX} Attempting to fetch course content for courseId: ${courseId}`);
  try {
    const response = await api.get<ApiResponse<PopulatedCourse>>(`/admin/course-content/courses/${courseId}/content`);
    console.log(`${LOG_PREFIX} Received response for course content:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Fetch course content error:`, error);
    throw error;
  }
};

// Update course structure
export const updateCourseStructure = async (courseId: string, updatedCourse: Course): Promise<ApiResponse<Course>> => {
  console.log(`${LOG_PREFIX} Updating course structure`, courseId, updatedCourse);
  try {
    const response = await api.put<ApiResponse<Course>>(`/admin/course-content/courses/${courseId}/structure`, updatedCourse);
    console.log(`${LOG_PREFIX} Course structure updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to update course structure:`, error);
    throw error;
  }
};

// Fetch sections
export const fetchSections = async (courseId: string): Promise<ApiResponse<Section[]>> => {
  console.log(`${LOG_PREFIX} Fetching sections for course`, courseId);
  try {
    const response = await api.get<ApiResponse<Section[]>>(`/admin/course-content/courses/${courseId}/sections`);
    console.log(`${LOG_PREFIX} Sections fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch sections:`, error);
    throw error;
  }
};

// Fetch lessons
export const fetchLessons = async (sectionIds: string[]): Promise<ApiResponse<Lesson[]>> => {
  console.log(`${LOG_PREFIX} Fetching lessons for sections`, sectionIds);
  try {
    const response = await api.get<ApiResponse<Lesson[]>>('/admin/course-content/lessons', { params: { sectionIds } });
    console.log(`${LOG_PREFIX} Lessons fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch lessons:`, error);
    throw error;
  }
};

// Fetch content items
export const fetchContentItems = async (contentItemIds: string[]): Promise<ApiResponse<ContentItem[]>> => {
  console.log(`${LOG_PREFIX} Fetching content items for IDs:`, contentItemIds);
  try {
    const response = await api.get<ApiResponse<ContentItem[]>>('/admin/course-content/content', { 
      params: { ids: contentItemIds.join(',') }
    });
    console.log(`${LOG_PREFIX} Content items fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch content items:`, error);
    throw error;
  }
};

// Fetch instructors
export const fetchInstructors = async (): Promise<ApiResponse<User[]>> => {
  console.log(`${LOG_PREFIX} Fetching instructors`);
  try {
    const response = await api.get<ApiResponse<User[]>>('/admin/course-content/courses/instructors');
    console.log(`${LOG_PREFIX} Instructors fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch instructors:`, error);
    throw error;
  }
};

// Fetch users for course
export const fetchUsersCourse = async (): Promise<ApiResponse<User[]>> => {
  console.log(`${LOG_PREFIX} Fetching users for course`);
  try {
    const response = await api.get<ApiResponse<User[]>>('/admin/course-content/courses/users');
    console.log(`${LOG_PREFIX} Users for course fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch users for course:`, error);
    throw error;
  }
};

// Get lesson
export const getLesson = async (lessonId: string): Promise<ApiResponse<Lesson>> => {
  console.log(`${LOG_PREFIX} Fetching lesson`, lessonId);
  try {
    const response = await api.get<ApiResponse<Lesson>>(`/admin/course-content/lessons/${lessonId}`);
    console.log(`${LOG_PREFIX} Lesson fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch lesson:`, error);
    throw error;
  }
};

// Get section
export const getSection = async (sectionId: string): Promise<ApiResponse<Section>> => {
  console.log(`${LOG_PREFIX} Fetching section`, sectionId);
  try {
    const response = await api.get<ApiResponse<Section>>(`/admin/course-content/sections/${sectionId}`);
    console.log(`${LOG_PREFIX} Section fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch section:`, error);
    throw error;
  }
};

// Get sections for a course
export const getSections = async (courseId: string): Promise<ApiResponse<Section[]>> => {
  console.log(`${LOG_PREFIX} Fetching sections for course`, courseId);
  try {
    const response = await api.get<ApiResponse<Section[]>>(`/admin/course-content/courses/${courseId}/sections`);
    console.log(`${LOG_PREFIX} Sections for course fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch sections for course:`, error);
    throw error;
  }
};

export default {
  getCourseManagementData,
  createCourse,
  updateCourse,
  deleteCourse,
  addUserToCourse,
  removeUserFromCourse,
  createSection,
  updateSection,
  deleteSection,
  createLesson,
  updateLesson,
  deleteLesson,
  addContent,
  updateContent,
  deleteContent,
  fetchCourseContent,
  updateCourseStructure,
  fetchSections,
  fetchLessons,
  fetchContentItems,
  fetchInstructors,
  fetchUsersCourse,
  getLesson,
  getSection,
  getSections
};