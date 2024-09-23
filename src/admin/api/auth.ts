// File: src/api/admin/auth.ts
import adminApi from './index';
import { AxiosResponse } from 'axios';
import { ApiResponse, LoginResponse } from '../types/models';
import { LOG_PREFIX } from './index';

export const checkAuthStatus = (): Promise<AxiosResponse<ApiResponse<{ isAuthenticated: boolean }>>> => {
  console.log(`${LOG_PREFIX} Checking auth status`);
  return adminApi.get('/auth/check');
};

export const login = (username: string, password: string): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
  console.log(`${LOG_PREFIX} Logging in`);
  return adminApi.post('/auth/login', { username, password });
};

export const logout = (): Promise<AxiosResponse<ApiResponse<void>>> => {
  console.log(`${LOG_PREFIX} Logging out`);
  return adminApi.post('/auth/logout');
};