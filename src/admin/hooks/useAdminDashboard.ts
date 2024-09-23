import { useState } from 'react';
import { message } from 'antd';
import { getDashboardStats } from '../api/dashboard';
import { DashboardStats, ApiResponse } from '../types/models';

export const useAdminDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetDashboardStats = async (): Promise<DashboardStats> => {
    setLoading(true);
    try {
      const response = await getDashboardStats();
      return response.data.data!;
    } catch (error) {
      console.error('Fetch dashboard stats error:', error);
      message.error('Failed to fetch dashboard stats');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getDashboardStats: handleGetDashboardStats
  };
};

export default useAdminDashboard;