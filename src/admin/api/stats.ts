// File: src/api/admin/stats.ts
import adminApi from './index';
import { AxiosResponse } from 'axios';
import { DashboardStats, ApiResponse } from '../types/models';
import { LOG_PREFIX } from './index';

export const getUserStats = (): Promise<AxiosResponse<ApiResponse<DashboardStats>>> => {
  console.log(`${LOG_PREFIX} Fetching user stats`);
  return adminApi.get('/admin/users/stats');
};