import adminApi from './index';
import { AxiosResponse } from 'axios';
import { ApiResponse, DashboardStats } from '../types/models';
import { LOG_PREFIX } from './index';

export const getDashboardStats = (): Promise<AxiosResponse<ApiResponse<DashboardStats>>> => {
  console.log(`${LOG_PREFIX} Fetching dashboard stats`);
  return adminApi.get('/admin/dashboard/stats');
};