export const USER_PERMISSIONS = {
    VIEW_USERS: 'view_users',
    CREATE_USER: 'create_user',
    EDIT_USER: 'edit_user',
    DELETE_USER: 'delete_user',
    CHANGE_USER_STATUS: 'change_user_status',
    EXPORT_USERS: 'export_users',
    IMPORT_USERS: 'import_users',
    VIEW_USER_ACTIVITY: 'view_user_activity',
    VIEW_USER_STATS: 'view_user_stats',
  };
  
  export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
    return userPermissions.includes(requiredPermission);
  };