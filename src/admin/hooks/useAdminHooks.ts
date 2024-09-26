import { useAdminCourses } from './useAdminCourses';
import { useAdminUsers } from './useAdminUsers';
import { useAdminLeads } from './useAdminLeads';
import { useAdminLearningCourses } from './useAdminLearningCourses';
import { CourseData, UserData, LeadData} from '../types/models';

export type { CourseData, UserData, LeadData};

export const useAdminHooks = () => {
  return {
    useAdminCourses,
    useAdminUsers,
    useAdminLeads,
    useAdminLearningCourses
  };
};

export default useAdminHooks;