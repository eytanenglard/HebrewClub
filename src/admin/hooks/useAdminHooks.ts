import { useAdminCourses } from './useAdminCourses';
import { useAdminUsers } from './useAdminUsers';
import { useAdminLeads } from './useAdminLeads';
import { useAdminDashboard } from './useAdminDashboard';
import { useAdminLearningCourses } from './useAdminLearningCourses';
import { CourseData, UserData, LeadData} from '../types/models';

export type { CourseData, UserData, LeadData};

export const useAdminHooks = () => {
  return {
    useAdminCourses,
    useAdminUsers,
    useAdminLeads,
    useAdminDashboard,
    useAdminLearningCourses
  };
};

export default useAdminHooks;