import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useAdminHooks } from "../hooks/useAdminHooks";
import { useAuth } from "../../context/AuthContext";
import { User } from "../types/models";

type AdminHooks = ReturnType<typeof useAdminHooks>;

interface AdminContextType {
  isAdminAuthenticated: boolean;
  loading: boolean;
  courses: ReturnType<AdminHooks["useAdminCourses"]>;
  users: ReturnType<AdminHooks["useAdminUsers"]>;
  leads: ReturnType<AdminHooks["useAdminLeads"]>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const isUserAdmin = (user: User | null): boolean => {
  // Implement your logic to determine if a user is an admin
  // For example:
  return user?.role.name === "admin";
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { useAdminCourses, useAdminUsers, useAdminLeads} =
    useAdminHooks();

  const { isLoggedIn, currentUser, isChecking } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Use the hooks
  const courses = useAdminCourses();
  const users = useAdminUsers();
  const leads = useAdminLeads();

  useEffect(() => {
    if (isLoggedIn && !isChecking) {
      setIsAdminAuthenticated(isUserAdmin(currentUser));
    } else {
      setIsAdminAuthenticated(false);
    }
  }, [isLoggedIn, isChecking, currentUser]);

  const contextValue: AdminContextType = {
    isAdminAuthenticated,
    loading: isChecking,
    courses,
    users,
    leads,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
