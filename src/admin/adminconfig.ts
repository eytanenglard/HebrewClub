export const ADMIN_CONFIG = {
    USER_MANAGEMENT: {
      USERS_PER_PAGE: 10,
      MAX_FAILED_LOGIN_ATTEMPTS: 5,
      LOCK_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
      PASSWORD_RESET_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    },
    API_ENDPOINTS: {
      USERS: '/api/admin/users',
      USER_ACTIVITY: '/api/admin/users/activity',
      USER_STATS: '/api/admin/users/stats',
    },
  };
  
  export default ADMIN_CONFIG;