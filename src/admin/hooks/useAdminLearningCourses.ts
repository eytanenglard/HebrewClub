import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { message } from 'antd';
import {
  getCourseManagementData as fetchCoursesAPI,
  createCourse,
  updateCourse,
  deleteCourse,
  addUserToCourse,
  removeUserFromCourse,
  fetchCourseContent,
  createSection as addSection,
  updateSection,
  deleteSection,
  createLesson as addLesson,
  updateLesson,
  deleteLesson,
  addContent as addContentItem,
  updateContent as updateContentItem,
  deleteContent as deleteContentItem,
  updateCourseStructure,
  fetchSections,
  fetchLessons,
  fetchContentItems,
  fetchInstructors as fetchInstructorsAPI,
  fetchUsersCourse as fetchUsersCourseAPI,

} from '../api/courses';
import { 
  Course, 
  CourseData, 
  Section, 
  SectionData, 
  Lesson, 
  LessonData, 
  ContentItem, 
  ContentItemData,
  PopulatedCourse,
  ApiResponse,
  User,
  PaginatedResponse
} from '../types/models';

export const useAdminLearningCourses = () => {
  const [loading, setLoading] = useState<boolean>(false);


  const handleFetchCourses = async (): Promise<PopulatedCourse[]> => {
    setLoading(true);
    try {
      const response: AxiosResponse<PaginatedResponse<Course[]>> = await fetchCoursesAPI();
      
      if (response.data.success && response.data.data) {
        // Fetch instructors and users
        const instructorsResponse = await handleFetchInstructors();
        const usersResponse = await handleFetchUsersCourse();
        
        // Fetch sections for all courses
        const allSections = await Promise.all(response.data.data.map(course => handleFetchSections(course.courseId)));
        const sectionsMap = new Map(allSections.flat().map(section => [section._id, section]));
  
        const instructorsMap = new Map(instructorsResponse.map(instructor => [instructor._id, instructor]));
        const usersMap = new Map(usersResponse.map(user => [user._id, user]));
  
        // Convert Course[] to PopulatedCourse[]
        const populatedCourses: PopulatedCourse[] = response.data.data.map(course => ({
          ...course,
          instructors: course.instructors.map(id => instructorsMap.get(id)).filter((instructor): instructor is User => !!instructor),
          users: course.users.map(id => usersMap.get(id)).filter((user): user is User => !!user),
          sections: course.sections.map(id => sectionsMap.get(id)).filter((section): section is Section => !!section)
        }));
  
        return populatedCourses;
      } else {
        throw new Error(response.data.error || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Fetch courses error:', error);
      message.error('Failed to fetch courses');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const handleFetchInstructors = async (): Promise<User[]> => {
    setLoading(true);
    try {
      const response = await fetchInstructorsAPI();
      return response.data.data!;
    } catch (error) {
      console.error('Fetch instructors error:', error);
      message.error('Failed to fetch instructors');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleFetchAllSections = async (): Promise<Section[]> => {
    setLoading(true);
    try {
      const coursesResponse = await handleFetchCourses();
      if (Array.isArray(coursesResponse)) {
        const allSectionsPromises = coursesResponse.map(course => handleFetchSections(course.courseId));
        const allSectionsArrays = await Promise.all(allSectionsPromises);
        const allSections = allSectionsArrays.flat();
        return allSections;
      } else {
        throw new Error("Invalid response format from fetchCourses");
      }
    } catch (error) {
      console.error('Fetch all sections error:', error);
      message.error('Failed to fetch all sections');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleFetchUsersCourse = async (): Promise<User[]> => {
    setLoading(true);
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = await fetchUsersCourseAPI();
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch users');
      }
      return response.data.data;
    } catch (error) {
      console.error('Fetch users error:', error);
      message.error('Failed to fetch users');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateCourse = async (courseData: CourseData): Promise<Course> => {
    setLoading(true);
    try {
      const response = await createCourse(courseData);
      message.success('Course created successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Create course error:', error);
      message.error('Failed to create course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseId: string, courseData: Partial<CourseData>): Promise<Course> => {
    setLoading(true);
    try {
      const response = await updateCourse(courseId, courseData);
      message.success('Course updated successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Update course error:', error);
      message.error('Failed to update course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteCourse(courseId);
      message.success('Course deleted successfully');
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
      message.success('User added to course successfully');
      return response.data.data!;
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
      message.success('User removed from course successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Remove user from course error:', error);
      message.error('Failed to remove user from course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCourseContent = async (courseId: string): Promise<PopulatedCourse> => {
    console.log(`[handleFetchCourseContent] Starting to fetch course content for courseId: ${courseId}`);
    setLoading(true);
    try {
      console.log(`[handleFetchCourseContent] Calling fetchCourseContent API`);
      const response = await fetchCourseContent(courseId);
      console.log(`[handleFetchCourseContent] API response received:`, response);

      if (response.success && response.data) {
        console.log(`[handleFetchCourseContent] Successfully fetched course content:`, response.data);
        return response.data;
      } else {
        console.error(`[handleFetchCourseContent] API call successful but data is invalid. Error:`, response.error);
        throw new Error(response.error || 'Failed to fetch course content');
      }
    } catch (error) {
      console.error('[handleFetchCourseContent] Error fetching course content:', error);
      message.error('Failed to fetch course content');
      throw error;
    } finally {
      console.log(`[handleFetchCourseContent] Finished fetching course content for courseId: ${courseId}`);
      setLoading(false);
    }
  };
  const handleAddSection = async (courseId: string, sectionData: SectionData): Promise<Section> => {
    setLoading(true);
    try {
      const response = await addSection(courseId, sectionData);
      message.success('Section added successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Add section error:', error);
      message.error('Failed to add section');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = async (sectionId: string, sectionData: Partial<SectionData>): Promise<Section> => {
    setLoading(true);
    try {
      const response = await updateSection(sectionId, sectionData);
      message.success('Section updated successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Update section error:', error);
      message.error('Failed to update section');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteSection(sectionId);
      message.success('Section deleted successfully');
    } catch (error) {
      console.error('Delete section error:', error);
      message.error('Failed to delete section');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (sectionId: string, lessonData: LessonData): Promise<Lesson> => {
    setLoading(true);
    try {
      const response = await addLesson(sectionId, lessonData);
      message.success('Lesson added successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Add lesson error:', error);
      message.error('Failed to add lesson');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLesson = async (lessonId: string, lessonData: Partial<LessonData>): Promise<Lesson> => {
    setLoading(true);
    try {
      const response = await updateLesson(lessonId, lessonData);
      message.success('Lesson updated successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Update lesson error:', error);
      message.error('Failed to update lesson');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteLesson(lessonId);
      message.success('Lesson deleted successfully');
    } catch (error) {
      console.error('Delete lesson error:', error);
      message.error('Failed to delete lesson');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddContentItem = async (lessonId: string, contentItemData: ContentItemData): Promise<ContentItem> => {
    setLoading(true);
    try {
      const response = await addContentItem(lessonId, contentItemData);
      message.success('Content item added successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Add content item error:', error);
      message.error('Failed to add content item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContentItem = async (contentItemId: string, contentItemData: Partial<ContentItemData>): Promise<ContentItem> => {
    setLoading(true);
    try {
      const response = await updateContentItem(contentItemId, contentItemData);
      message.success('Content item updated successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Update content item error:', error);
      message.error('Failed to update content item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContentItem = async (contentItemId: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteContentItem(contentItemId);
      message.success('Content item deleted successfully');
    } catch (error) {
      console.error('Delete content item error:', error);
      message.error('Failed to delete content item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourseStructure = async (courseId: string, updatedCourse: PopulatedCourse): Promise<PopulatedCourse> => {
    setLoading(true);
    try {
      // Transform PopulatedCourse back to Course
      const courseToUpdate: Course = {
        ...updatedCourse,
        instructors: updatedCourse.instructors.map(instructor => instructor._id),
        users: updatedCourse.users.map(user => user._id),
        sections: updatedCourse.sections.map(section => section._id)
      };
  
      const response = await updateCourseStructure(courseId, courseToUpdate);
      
      // Transform the returned Course back to PopulatedCourse
      const updatedPopulatedCourse: PopulatedCourse = {
        ...response.data.data!,
        instructors: updatedCourse.instructors,
        users: updatedCourse.users,
        sections: updatedCourse.sections
      };
  
      message.success('Course structure updated successfully');
      return updatedPopulatedCourse;
    } catch (error) {
      console.error('Update course structure error:', error);
      message.error('Failed to update course structure');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // New functions
  const handleFetchSections = async (courseId: string): Promise<Section[]> => {
    setLoading(true);
    try {
      const response = await fetchSections(courseId);
      return response.data.data!;
    } catch (error) {
      console.error('Fetch sections error:', error);
      message.error('Failed to fetch sections');
      throw error;
    } finally {
      setLoading(false);
    }
  };
 
  const handleFetchContentItems = async (contentItemIds: string[]): Promise<ContentItem[]> => {
    setLoading(true);
    try {
      console.log('[handleFetchContentItems] Fetching content items for IDs:', contentItemIds);
      const response: ApiResponse<ContentItem[]> = await fetchContentItems(contentItemIds);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch content items');
      }
      console.log('[handleFetchContentItems] Fetched content items:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch content items error:', error);
      message.error('Failed to fetch content items');
      return [];
    } finally {
      setLoading(false);
    }
  };
  const handleFetchLessons = async (sectionIds: string[]): Promise<Lesson[]> => {
    setLoading(true);
    console.log(`[handleFetchLessons] Starting to fetch lessons for sections:`, sectionIds);
    
    try {
      if (!sectionIds || sectionIds.length === 0) {
        console.warn('[handleFetchLessons] No section IDs provided');
        return [];
      }
  
      const response: ApiResponse<Lesson[]> = await fetchLessons(sectionIds);
      console.log(`[handleFetchLessons] API response:`, response);
  
      if (!response.success || !response.data) {
        console.error(`[handleFetchLessons] API call failed:`, response.error);
        throw new Error(response.error || 'Failed to fetch lessons');
      }
  
      if (!Array.isArray(response.data)) {
        console.error(`[handleFetchLessons] Invalid data format. Expected array, got:`, typeof response.data);
        throw new Error('Invalid data format received from server');
      }
  
      console.log(`[handleFetchLessons] Successfully fetched ${response.data.length} lessons`);
      return response.data;
    } catch (error) {
      console.error('[handleFetchLessons] Error:', error);
      message.error('Failed to fetch lessons');
      return []; // Return an empty array instead of throwing
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    fetchCourses: handleFetchCourses,
    fetchInstructors: handleFetchInstructors,
    fetchUsersCourse: handleFetchUsersCourse,
    createCourse: handleCreateCourse,
    updateCourse: handleUpdateCourse,
    deleteCourse: handleDeleteCourse,
    addUserToCourse: handleAddUserToCourse,
    removeUserFromCourse: handleRemoveUserFromCourse,
    fetchCourseContent: handleFetchCourseContent,
    addSection: handleAddSection,
    updateSection: handleUpdateSection,
    deleteSection: handleDeleteSection,
    addLesson: handleAddLesson,
    updateLesson: handleUpdateLesson,
    deleteLesson: handleDeleteLesson,
    addContentItem: handleAddContentItem,
    updateContentItem: handleUpdateContentItem,
    deleteContentItem: handleDeleteContentItem,
    updateCourseStructure: handleUpdateCourseStructure,
    fetchSections: handleFetchSections,
    fetchLessons: handleFetchLessons,
    fetchContentItems: handleFetchContentItems,
    fetchAllSections: handleFetchAllSections 
  };
};

export default useAdminLearningCourses;