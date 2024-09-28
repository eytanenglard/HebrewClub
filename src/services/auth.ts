
import api from './api';
import { ApiResponse, User, LoginResponse, EmailVerificationRequest, EmailVerificationResponse } from '../admin/types/models';
const LOG_PREFIX = '[auth.ts]';
import axios, { AxiosResponse } from 'axios';

let csrfToken: string | null = null;
let tokenExpirationTime: number = 0;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const fetchCsrfToken = async (): Promise<string | null> => {
  console.log(`${LOG_PREFIX} Fetching new CSRF token...`);
  try {
    const response = await api.get('/auth/csrf-token');
    const newCsrfToken = response.data.csrfToken;
    if (!newCsrfToken) {
      throw new Error('Received empty CSRF token from server');
    }
    console.log(`${LOG_PREFIX} New CSRF token fetched`);
    return newCsrfToken;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to fetch CSRF token`, error);
    return null;
  }
};
export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
  try {
    await ensureCsrfToken();
    console.log(`Resetting password with token: ${token}`);
    const response = await api.post<ApiResponse<null>>('/auth/reset-password', { token, newPassword });
    console.log(`${LOG_PREFIX} Password reset request sent successfully`);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to initiate password reset:`, error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        data: null,
        error: error.response.data.error || 'An error occurred while initiating the password reset'
      };
    }
    throw error;
  }
};
export const ensureCsrfToken = async (forceRefresh = false): Promise<string | null> => {
  const now = Date.now();
  if (csrfToken && now < tokenExpirationTime && !forceRefresh) {
    return csrfToken;
  }
  const sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    console.log(`${LOG_PREFIX} No session ID found, fetching new CSRF token`);
    return fetchNewCsrfToken();
  }

  if (csrfToken && now < tokenExpirationTime && !forceRefresh) {
    console.log(`${LOG_PREFIX} Using existing CSRF token`);
    return csrfToken;
  }

  if (isRefreshing) {
    console.log(`${LOG_PREFIX} CSRF token refresh in progress, waiting...`);
    return refreshPromise!;
  }

  isRefreshing = true;
  refreshPromise = fetchNewCsrfToken();
  return refreshPromise;
};

const fetchNewCsrfToken = async (): Promise<string | null> => {
  try {
    console.log(`${LOG_PREFIX} Attempting to fetch new CSRF token`);
    
    const response: AxiosResponse = await api.get('/auth/csrf-token');
    
    console.log(`${LOG_PREFIX} CSRF Token Response:`, response.data, response.headers);
    
    const newCsrfToken: string | undefined = response.data.csrfToken;
    const newSessionId: string | undefined = response.data.sessionId || response.headers['x-session-id'];
    
    if (!newCsrfToken || !newSessionId) {
      console.error(`${LOG_PREFIX} Missing CSRF token or session ID in response`);
      throw new Error('Received empty CSRF token or session ID from server');
    }
    
    csrfToken = newCsrfToken;
    tokenExpirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    
    localStorage.setItem('sessionId', newSessionId);
    
    api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
    api.defaults.headers.common['X-Session-ID'] = newSessionId;
    
    console.log(`${LOG_PREFIX} New CSRF token set:`, csrfToken);
    console.log(`${LOG_PREFIX} New session ID set:`, newSessionId);
    console.log(`${LOG_PREFIX} Token expiration time set to:`, new Date(tokenExpirationTime).toISOString());
    
    return csrfToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`${LOG_PREFIX} Failed to fetch CSRF token. Axios error:`, error.message);
      if (error.response) {
        console.error(`${LOG_PREFIX} Error response:`, error.response.data);
        console.error(`${LOG_PREFIX} Error status:`, error.response.status);
        console.error(`${LOG_PREFIX} Error headers:`, error.response.headers);
      } else if (error.request) {
        console.error(`${LOG_PREFIX} Error request:`, error.request);
      }
    } else {
      console.error(`${LOG_PREFIX} Failed to fetch CSRF token. Unexpected error:`, error);
    }
    return null;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
    console.log(`${LOG_PREFIX} Token refresh process completed`);
  }
};


export const register = async (userData: Partial<User>): Promise<LoginResponse> => {
  try {
    console.log(`${LOG_PREFIX} Attempting to register user...`, userData);
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} CSRF token obtained, sending registration request`);
    const response = await api.post<LoginResponse>('/auth/register', userData);
    console.log(`${LOG_PREFIX} Registration request sent, response received:`, response);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log(`${LOG_PREFIX} User registered successfully. Token saved.`);
    }
    console.log('response',response);
    console.log('response.data',response.data);
    console.log('response.data.token',response.data.token);
    console.log('response.data.user',response.data.user);
    return response.data;
  } catch (error: unknown) {
    
    console.error(`${LOG_PREFIX} Registration failed`, error);
    if (error instanceof Error) {
      throw new Error(`Registration failed: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred during registration');
    }
  }
};

export const verifyEmail = async (verificationData: EmailVerificationRequest): Promise<EmailVerificationResponse> => {
  console.log(`${LOG_PREFIX} Verifying email with token or code`);
  try {
    const response = await api.post<EmailVerificationResponse>('/auth/verify-email', verificationData);
    console.log(`${LOG_PREFIX} Email verification response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Email verification failed:`, error);
    return {
      success: false,
      message: 'Email verification failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const resendVerificationEmail = async (email: string): Promise<ApiResponse<null>> => {
  console.log(`${LOG_PREFIX} Resending verification email for:`, email);
  try {
    const response = await api.post<ApiResponse<null>>('/auth/resend-verification', { email });
    console.log(`${LOG_PREFIX} Verification email resent successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to resend verification email:`, error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        data: null,
        error: error.response.data.error || 'An error occurred while resending the verification email'
      };
    }
    throw error;
  }
};
export const handleDevToolsLogin = async (): Promise<void> => {
  console.log(`${LOG_PREFIX} Handling DevTools GET request to /auth/login`);
  try {
    await api.get('/auth/login');
    console.log(`${LOG_PREFIX} DevTools login request handled successfully`);
  } catch (error) {
    console.error(`${LOG_PREFIX} Error handling DevTools login request:`, error);
    // We're ignoring this error as it's expected
  }
};

export const login = async (usernameOrEmail: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> => {
  try {
    console.log(`${LOG_PREFIX} Attempting login for user: ${usernameOrEmail}`);
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} CSRF token obtained, sending login request`);
    
    const loginData = {
      usernameOrEmail,
      password,
      rememberMe
    };
    
    console.log(`${LOG_PREFIX} Sending login data:`, loginData);
    
    const response = await api.post<LoginResponse>('/auth/login', loginData);
    
    console.log(`${LOG_PREFIX} Login response received:`, response.data);
    if (response.data.success && response.data.token) {
      console.log(`${LOG_PREFIX} Login successful. Token received.`);
      localStorage.setItem('token', response.data.token);
      console.log(`${LOG_PREFIX} Token saved to localStorage`);
    } else {
      console.warn(`${LOG_PREFIX} Login failed or response does not contain a token.`);
    }
    return response.data;
  } catch (error: unknown) {
    console.error(`${LOG_PREFIX} Login failed`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        token: null,
        user: null,
        error: error.response?.data?.error || 'An error occurred during login'
      };
    }
    throw error; // Re-throw unexpected errors
  }
};


export const logout = async (): Promise<void> => {
  try {
    console.log(`${LOG_PREFIX} Attempting logout`);
    await ensureCsrfToken();
    await api.post('/auth/logout');
    console.log(`${LOG_PREFIX} Logout request sent successfully`);
  } catch (error: unknown) {
    console.error(`${LOG_PREFIX} Logout failed`, error);
  } finally {
    csrfToken = null;
    tokenExpirationTime = 0;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['X-CSRF-Token'];
    console.log(`${LOG_PREFIX} CSRF token and token removed from localStorage and headers`);
  }
};

export const checkAuth = async (): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Checking authentication status`);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log(`${LOG_PREFIX} No token found, user is not authenticated`);
      return false;
    }
    await ensureCsrfToken();
    const response = await api.get('/auth/checkAuth');
    const isAuthenticated = response.data.isAuthenticated;
    console.log(`${LOG_PREFIX} Authentication check response:`, isAuthenticated);
    return isAuthenticated;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error checking authentication:`, error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  console.log(`${LOG_PREFIX} Fetching current user`);
  try {
    await ensureCsrfToken();
    const response = await api.get<{ success: boolean; user: User | null; message?: string }>('/auth/current-user');
    if (response.data.success && response.data.user) {
      console.log(`${LOG_PREFIX} Current user fetched successfully:`, response.data.user);
      return response.data.user;
    } else {
      console.log(`${LOG_PREFIX} No user data returned or user not authenticated`);
      return null;
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} Error fetching current user:`, error);
    return null;
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    console.log(`${LOG_PREFIX} Verifying token`);
    await ensureCsrfToken();
    const response = await api.post('/auth/verify-token', { token });
    return response.data.isValid;
  } catch (error) {
    console.error(`${LOG_PREFIX} Token verification failed:`, error);
    return false;
  }
};

export default {
  ensureCsrfToken,
  fetchCsrfToken,
  register,
  login,
  logout,
  checkAuth,
  getCurrentUser,
  verifyToken,
  handleDevToolsLogin,
  resetPassword,
};
