import { useState } from 'react';
import { message } from 'antd';
import { fetchLeads, createLead, updateLead, deleteLead } from '../api/leads';
import { Lead, LeadData, PaginatedResponse } from '../types/models';

export const useAdminLeads = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchLeads = async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Lead[]>> => {
    setLoading(true);
    try {
      const response = await fetchLeads(page, limit, search);
      return response.data;
    } catch (error) {
      console.error('Fetch leads error:', error);
      message.error('Failed to fetch leads');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (leadData: LeadData): Promise<Lead> => {
    setLoading(true);
    try {
      const response = await createLead(leadData);
      message.success('Lead created successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Create lead error:', error);
      message.error('Failed to create lead');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLead = async (id: string, leadData: Partial<LeadData>): Promise<Lead> => {
    setLoading(true);
    try {
      const response = await updateLead(id, leadData);
      message.success('Lead updated successfully');
      return response.data.data!;
    } catch (error) {
      console.error('Update lead error:', error);
      message.error('Failed to update lead');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteLead(id);
      message.success('Lead deleted successfully');
    } catch (error) {
      console.error('Delete lead error:', error);
      message.error('Failed to delete lead');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchLeads: handleFetchLeads,
    createLead: handleCreateLead,
    updateLead: handleUpdateLead,
    deleteLead: handleDeleteLead
  };
};

export default useAdminLeads;