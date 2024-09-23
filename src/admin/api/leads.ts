import adminApi from './index';
import { AxiosResponse } from 'axios';
import { Lead, LeadData, PaginatedResponse, ApiResponse } from '../types/models';
import { LOG_PREFIX } from './index';

export const fetchLeads = (page: number = 1, limit: number = 10, search?: string): Promise<AxiosResponse<PaginatedResponse<Lead[]>>> => {
  console.log(`${LOG_PREFIX} Fetching leads`);
  return adminApi.get('/admin/leads', { params: { page, limit, search } });
};

export const createLead = (leadData: LeadData): Promise<AxiosResponse<ApiResponse<Lead>>> => {
  console.log(`${LOG_PREFIX} Creating lead`, leadData);
  return adminApi.post('/admin/leads', leadData);
};

export const updateLead = (leadId: string, leadData: Partial<Lead>): Promise<AxiosResponse<ApiResponse<Lead>>> => {
  console.log(`${LOG_PREFIX} Updating lead`, leadId, leadData);
  return adminApi.put(`/admin/leads/${leadId}`, leadData);
};

export const deleteLead = (leadId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
  console.log(`${LOG_PREFIX} Deleting lead`, leadId);
  return adminApi.delete(`/admin/leads/${leadId}`);
};