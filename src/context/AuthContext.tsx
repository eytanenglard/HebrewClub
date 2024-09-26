import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { User, LoginResponse } from "../admin/types/models";
import * as authService from "../services/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  isPartiallyLoggedIn: boolean;
  currentUser: User | null;
  isChecking: boolean;
  loginError: string | null;
  login: (
    usernameOrEmail: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Partial<User>) => Promise<LoginResponse>;
  checkAuthStatus: () => Promise<void>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const LOG_PREFIX = "[AuthContext]";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isPartiallyLoggedIn, setIsPartiallyLoggedIn] =
    useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const checkAuthRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedRef = useRef<number>(0);
  const csrfTokenPromise = useRef<Promise<void> | null>(null);

  const ensureCsrfToken = useCallback(async (): Promise<void> => {
    if (!csrfTokenPromise.current) {
      csrfTokenPromise.current = (async () => {
        try {
          console.log(`${LOG_PREFIX} Ensuring CSRF token`);
          await authService.ensureCsrfToken();
          console.log(`${LOG_PREFIX} CSRF token ensured successfully`);
        } catch (error) {
          console.error(`${LOG_PREFIX} Failed to ensure CSRF token:`, error);
          throw error;
        } finally {
          csrfTokenPromise.current = null;
        }
      })();
    }
    return csrfTokenPromise.current;
  }, []);

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    console.log(`${LOG_PREFIX} Checking auth status`);
    setIsChecking(true);
    try {
      await ensureCsrfToken();
      const isAuthenticated = await authService.checkAuth();
      if (isAuthenticated) {
        const user = await authService.getCurrentUser();
        if (user) {
          console.log(`${LOG_PREFIX} User authenticated:`, user);
          setCurrentUser(user);
          setIsLoggedIn(true);
          setIsPartiallyLoggedIn(false);
        } else {
          console.log(`${LOG_PREFIX} User authenticated but no user data`);
          setCurrentUser(null);
          setIsLoggedIn(false);
          setIsPartiallyLoggedIn(true);
        }
      } else {
        console.log(`${LOG_PREFIX} User not authenticated`);
        setIsLoggedIn(false);
        setIsPartiallyLoggedIn(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Error checking auth status:`, error);
      setIsLoggedIn(false);
      setIsPartiallyLoggedIn(false);
      setCurrentUser(null);
    } finally {
      setIsChecking(false);
      lastCheckedRef.current = Date.now();
    }
  }, [ensureCsrfToken]);

  const login = async (
    usernameOrEmail: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> => {
    console.log(`${LOG_PREFIX} Attempting login for user:`, usernameOrEmail);
    setIsChecking(true);
    setLoginError(null);
    try {
      const response: LoginResponse = await authService.login(
        usernameOrEmail,
        password,
        rememberMe
      );
      console.log(`${LOG_PREFIX} Login response:`, response);
      if (response.success && response.user) {
        console.log(`${LOG_PREFIX} Login successful, user:`, response.user);
        setIsLoggedIn(true);
        setIsPartiallyLoggedIn(false);
        setCurrentUser(response.user);
        return true;
      } else {
        console.log(`${LOG_PREFIX} Login failed:`, response.error);
        setIsLoggedIn(false);
        setIsPartiallyLoggedIn(false);
        setCurrentUser(null);
        setLoginError(response.error || "Login failed. Please try again.");
        return false;
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Login failed:`, error);
      setIsLoggedIn(false);
      setIsPartiallyLoggedIn(false);
      setCurrentUser(null);
      setLoginError("An unexpected error occurred. Please try again later.");
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    console.log(`${LOG_PREFIX} Attempting logout`);
    setIsChecking(true);
    try {
      await ensureCsrfToken();
      await authService.logout();
      console.log(`${LOG_PREFIX} Logout successful`);
    } catch (error) {
      console.error(`${LOG_PREFIX} Logout failed:`, error);
    } finally {
      setIsLoggedIn(false);
      setIsPartiallyLoggedIn(false);
      setCurrentUser(null);
      setIsChecking(false);
      lastCheckedRef.current = 0;
    }
  }, [ensureCsrfToken]);

  const register = async (userData: Partial<User>): Promise<LoginResponse> => {
    setIsChecking(true);
    setLoginError(null);
    try {
      const response: LoginResponse = await authService.register(userData);
      if (response.success && response.user) {
        console.log(
          `${LOG_PREFIX} Registration successful, user:`,
          response.user
        );
        setIsLoggedIn(true);
        setIsPartiallyLoggedIn(false);
        setCurrentUser(response.user);
      } else {
        console.log(`${LOG_PREFIX} Registration failed:`, response.error);
        setIsLoggedIn(false);
        setIsPartiallyLoggedIn(false);
        setCurrentUser(null);
        setLoginError(
          response.error || "Registration failed. Please try again."
        );
      }
      return response;
    } catch (error) {
      console.error(`${LOG_PREFIX} Registration failed:`, error);
      setIsLoggedIn(false);
      setIsPartiallyLoggedIn(false);
      setCurrentUser(null);
      setLoginError(
        "An unexpected error occurred during registration. Please try again later."
      );
      return {
        success: false,
        token: null,
        user: null,
        error:
          "An unexpected error occurred during registration. Please try again later.",
      };
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    console.log(`${LOG_PREFIX} Starting authentication check`);
    checkAuthStatus();

    checkAuthRef.current = setInterval(() => {
      checkAuthStatus();
    }, 30 * 60 * 1000); // Check every 5 minutes

    return () => {
      if (checkAuthRef.current) {
        clearInterval(checkAuthRef.current);
      }
    };
  }, [checkAuthStatus]);

  useEffect(() => {
    console.log(
      `${LOG_PREFIX} Auth state changed: isLoggedIn=${isLoggedIn}, currentUser=`,
      currentUser
    );
  }, [isLoggedIn, currentUser]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isPartiallyLoggedIn,
        currentUser,
        isChecking,
        loginError,
        login,
        logout,
        register,
        checkAuthStatus,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
