import adminApi from '../api';
import { User, PaginatedResponse, ApiResponse, UserStats, UserActivity, SystemSettings, Course, Assignment, Payment, Lead, Group, Permission, Role, CourseData } from '../types/models';

const adminService = {
  // User Management
  getUsers: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<User[]>> => {
    const response = await adminApi.get<PaginatedResponse<User[]>>('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  },
  createUser: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await adminApi.post<ApiResponse<User>>('/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await adminApi.put<ApiResponse<User>>(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await adminApi.delete<ApiResponse<void>>(`/admin/users/${userId}`);
    return response.data;
  },

  exportUsers: async (): Promise<Blob> => {
    const response = await adminApi.get('/admin/users/export', { responseType: 'blob' });
    return response.data;
  },

  importUsers: async (file: File): Promise<ApiResponse<void>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await adminApi.post<ApiResponse<void>>('/admin/users/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  resetUserPassword: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await adminApi.post<ApiResponse<void>>(`/admin/users/${userId}/reset-password`);
    return response.data;
  },

  getUserActivity: async (userId: string): Promise<ApiResponse<UserActivity[]>> => {
    const response = await adminApi.get<ApiResponse<UserActivity[]>>(`/admin/users/${userId}/activity`);
    return response.data;
  },

  updateUserStatus: async (userId: string, status: 'active' | 'locked'): Promise<ApiResponse<User>> => {
    const response = await adminApi.patch<ApiResponse<User>>(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    const response = await adminApi.get<ApiResponse<UserStats>>('/admin/users/stats');
    return response.data;
  },

  // Course Management
  getCourses: async (): Promise<ApiResponse<Course[]>> => {
    const response = await adminApi.get<ApiResponse<Course[]>>('/admin/courses');
    return response.data;
  },

  createCourse: async (courseData: CourseData): Promise<ApiResponse<Course>> => {
    const response = await adminApi.post<ApiResponse<Course>>('/admin/courses', courseData);
    return response.data;
  },

  updateCourse: async (courseId: string, courseData: Partial<CourseData>): Promise<ApiResponse<Course>> => {
    const response = await adminApi.put<ApiResponse<Course>>(`/admin/courses/${courseId}`, courseData);
    return response.data;
  },

  deleteCourse: async (courseId: string): Promise<ApiResponse<void>> => {
    const response = await adminApi.delete<ApiResponse<void>>(`/admin/courses/${courseId}`);
    return response.data;
  },

  addUserToCourse: async (courseId: string, userId: string): Promise<ApiResponse<Course>> => {
    const response = await adminApi.post<ApiResponse<Course>>(`/admin/courses/${courseId}/users/${userId}`);
    return response.data;
  },

  removeUserFromCourse: async (courseId: string, userId: string): Promise<ApiResponse<Course>> => {
    const response = await adminApi.delete<ApiResponse<Course>>(`/admin/courses/${courseId}/users/${userId}`);
    return response.data;
  },

  // System Settings
  getSystemSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    const response = await adminApi.get<ApiResponse<SystemSettings>>('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> => {
    const response = await adminApi.put<ApiResponse<SystemSettings>>('/admin/settings', settings);
    return response.data;
  },

  // Logs
  getSystemLogs: async (page: number = 1, limit: number = 50): Promise<PaginatedResponse<any[]>> => {
    const response = await adminApi.get<PaginatedResponse<any[]>>('/admin/logs', {
      params: { page, limit }
    });
    return response.data;
  },

  // Backup and Restore
  createBackup: async (): Promise<ApiResponse<void>> => {
    const response = await adminApi.post<ApiResponse<void>>('/admin/backup');
    return response.data;
  },

  restoreBackup: async (backupFile: File): Promise<ApiResponse<void>> => {
    const formData = new FormData();
    formData.append('backupFile', backupFile);
    const response = await adminApi.post<ApiResponse<void>>('/admin/restore', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Assignment Management
  getAssignments: async (courseId: string): Promise<ApiResponse<Assignment[]>> => {
    const response = await adminApi.get<ApiResponse<Assignment[]>>(`/admin/courses/${courseId}/assignments`);
    return response.data;
  },

  createAssignment: async (courseId: string, assignmentData: Partial<Assignment>): Promise<ApiResponse<Assignment>> => {
    const response = await adminApi.post<ApiResponse<Assignment>>(`/admin/courses/${courseId}/assignments`, assignmentData);
    return response.data;
  },

  updateAssignment: async (courseId: string, assignmentId: string, assignmentData: Partial<Assignment>): Promise<ApiResponse<Assignment>> => {
    const response = await adminApi.put<ApiResponse<Assignment>>(`/admin/courses/${courseId}/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (courseId: string, assignmentId: string): Promise<ApiResponse<void>> => {
    const response = await adminApi.delete<ApiResponse<void>>(`/admin/courses/${courseId}/assignments/${assignmentId}`);
    return response.data;
  },

  // Payment Management
  getPayments: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Payment>> => {
    const response = await adminApi.get<PaginatedResponse<Payment>>('/admin/payments', {
      params: { page, limit }
    });
    return response.data;
  },

  updatePaymentStatus: async (paymentId: string, status: Payment['status']): Promise<ApiResponse<Payment>> => {
    const response = await adminApi.patch<ApiResponse<Payment>>(`/admin/payments/${paymentId}/status`, { status });
    return response.data;
  },

  // Lead Management
  getLeads: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Lead>> => {
    const response = await adminApi.get<PaginatedResponse<Lead>>('/admin/leads', {
      params: { page, limit }
    });
    return response.data;
  },

  updateLead: async (leadId: string, leadData: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    const response = await adminApi.put<ApiResponse<Lead>>(`/admin/leads/${leadId}`, leadData);
    return response.data;
  },

  // Group Management
  getGroups: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Group>> => {
    const response = await adminApi.get<PaginatedResponse<Group>>('/admin/groups', {
      params: { page, limit }
    });
    return response.data;
  },

  createGroup: async (groupData: Partial<Group>): Promise<ApiResponse<Group>> => {
    const response = await adminApi.post<ApiResponse<Group>>('/admin/groups', groupData);
    return response.data;
  },
  updateGroup: async (groupId: string, groupData: Partial<Group>): Promise<ApiResponse<Group>> => {
    const response = await adminApi.put<ApiResponse<Group>>(`/admin/groups/${groupId}`, groupData);
    return response.data;
  },

  deleteGroup: async (groupId: string): Promise<ApiResponse<void>> => {
    const response = await adminApi.delete<ApiResponse<void>>(`/admin/groups/${groupId}`);
    return response.data;
  },

  // Permission and Role Management
  getPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    const response = await adminApi.get<ApiResponse<Permission[]>>('/admin/permissions');
    return response.data;
  },

  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const response = await adminApi.get<ApiResponse<Role[]>>('/admin/roles');
    return response.data;
  },

  createRole: async (roleData: Partial<Role>): Promise<ApiResponse<Role>> => {
    const response = await adminApi.post<ApiResponse<Role>>('/admin/roles', roleData);
    return response.data;
  },

  updateRole: async (roleId: string, roleData: Partial<Role>): Promise<ApiResponse<Role>> => {
    const response = await adminApi.put<ApiResponse<Role>>(`/admin/roles/${roleId}`, roleData);
    return response.data;
  },

  deleteRole: async (roleId: string): Promise<ApiResponse<void>> => {
    const response = await adminApi.delete<ApiResponse<void>>(`/admin/roles/${roleId}`);
    return response.data;
  },
  // User Roles Management
  assignRoleToUser: async (userId: string, roleId: string): Promise<ApiResponse<User>> => {
    const response = await adminApi.post<ApiResponse<User>>(`/admin/users/${userId}/roles/${roleId}`);
    return response.data;
  },

  removeRoleFromUser: async (userId: string, roleId: string): Promise<ApiResponse<User>> => {
    const response = await adminApi.delete<ApiResponse<User>>(`/admin/users/${userId}/roles/${roleId}`);
    return response.data;
  },

  // Course Content Management
  getCourseContent: async (courseId: string): Promise<ApiResponse<any>> => {
    const response = await adminApi.get<ApiResponse<any>>(`/admin/courses/${courseId}/content`);
    return response.data;
  },

  updateCourseContent: async (courseId: string, contentData: any): Promise<ApiResponse<any>> => {
    const response = await adminApi.put<ApiResponse<any>>(`/admin/courses/${courseId}/content`, contentData);
    return response.data;
  },

  // Analytics
  getCourseAnalytics: async (courseId: string): Promise<ApiResponse<any>> => {
    const response = await adminApi.get<ApiResponse<any>>(`/admin/courses/${courseId}/analytics`);
    return response.data;
  },

  getUserAnalytics: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await adminApi.get<ApiResponse<any>>(`/admin/users/${userId}/analytics`);
    return response.data;
  },

  // Notifications
  sendNotification: async (notificationData: any): Promise<ApiResponse<void>> => {
    const response = await adminApi.post<ApiResponse<void>>('/admin/notifications', notificationData);
    return response.data;
  },

  // Search
  searchUsers: async (query: string): Promise<ApiResponse<User[]>> => {
    const response = await adminApi.get<ApiResponse<User[]>>('/admin/search/users', { params: { query } });
    return response.data;
  },

  searchCourses: async (query: string): Promise<ApiResponse<Course[]>> => {
    const response = await adminApi.get<ApiResponse<Course[]>>('/admin/search/courses', { params: { query } });
    return response.data;
  },
};

export default adminService;