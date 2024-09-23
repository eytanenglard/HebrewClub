import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const LOG_PREFIX = '[emailService.ts]';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(`${LOG_PREFIX} API_BASE_URL:`, API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const protectedRoutes = ['/api/email'];

let csrfToken: string | null = null;
let tokenExpirationTime: number = 0;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function getCookieValue(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

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

export const ensureCsrfToken = async (forceRefresh = false): Promise<string | null> => {
  const now = Date.now();
  
  if (csrfToken && now < tokenExpirationTime && !forceRefresh) {
    console.log(`${LOG_PREFIX} Using existing CSRF token`);
    return csrfToken;
  }

  if (isRefreshing) {
    console.log(`${LOG_PREFIX} CSRF token refresh in progress, waiting...`);
    return refreshPromise!;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const newToken = await fetchCsrfToken();
      if (newToken) {
        csrfToken = newToken;
        tokenExpirationTime = now + 10 * 60 * 1000; // 10 minutes validity
        api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
        console.log(`${LOG_PREFIX} New CSRF token set`);
      }
      return csrfToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

api.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  console.log(`${LOG_PREFIX} Sending ${config.method} request to: ${config.url}`);
  console.log(`${LOG_PREFIX} Request headers:`, config.headers);
  console.log(`${LOG_PREFIX} Request data:`, config.data);
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (config.url && protectedRoutes.some(route => config.url!.includes(route))) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
      console.log(`${LOG_PREFIX} Added CSRF token to request`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`${LOG_PREFIX} Response received:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error(`${LOG_PREFIX} API Error:`, axiosError.response.status, axiosError.response.data);
      } else if (axiosError.request) {
        console.error(`${LOG_PREFIX} No response received:`, axiosError.request);
      } else {
        console.error(`${LOG_PREFIX} Error setting up request:`, axiosError.message);
      }
    } else {
      console.error(`${LOG_PREFIX} Non-Axios error:`, error);
    }
    return Promise.reject(error);
  }
);

// הגדרת ברירת מחדל להוספת טוקן CSRF לכל בקשה
api.defaults.headers.common['X-CSRF-Token'] = getCookieValue('XSRF-TOKEN');

// פונקציה לקבלת טוקן CSRF חדש מהשרת
async function refreshCsrfToken() {
  try {
    const response = await api.get('/auth/csrf-token');
    api.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
  } catch (error) {
    console.error('Failed to refresh CSRF token:', error);
  }
}

// קריאה לפונקציה זו לפני ביצוע פעולות שדורשות אימות CSRF
await refreshCsrfToken();

export const sendWelcomeEmail = async (to: string, name: string, temporaryPassword: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending welcome email to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/welcome`);
    console.log(`${LOG_PREFIX} Request content:`, { to, name, temporaryPassword });
    const response = await api.post('/api/email/welcome', { to, name, temporaryPassword });
    console.log(`${LOG_PREFIX} Welcome email sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending welcome email:`, error);
    throw error;
  }
};
export const sendCourseWelcomeEmail = async (to: string, userName: string, courseName: string): Promise<boolean> => {
  try {
    const response = await api.post('/email/course-welcome', { to, userName, courseName });
    return response.data.success;
  } catch (error) {
    console.error('Error sending course welcome email:', error);
    throw error;
  }
};
export const sendPasswordResetEmail = async (to: string, resetToken: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending password reset email to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/password-reset`);
    console.log(`${LOG_PREFIX} Request content:`, { to, resetToken });
    const response = await api.post('/api/email/password-reset', { to, resetToken });
    console.log(`${LOG_PREFIX} Password reset email sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending password reset email:`, error);
    throw error;
  }
};

export const sendCoursePurchaseConfirmation = async (to: string, courseName: string, amount: number): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending course purchase confirmation to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/course-purchase`);
    console.log(`${LOG_PREFIX} Request content:`, { to, courseName, amount });
    const response = await api.post('/api/email/course-purchase', { to, courseName, amount });
    console.log(`${LOG_PREFIX} Course purchase confirmation sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending course purchase confirmation:`, error);
    throw error;
  }
};

export const sendEmailVerification = async (to: string, verificationCode: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending email verification to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/verify`);
    console.log(`${LOG_PREFIX} Request content:`, { to, verificationCode });
    const response = await api.post('/api/email/verify', { to, verificationCode });
    console.log(`${LOG_PREFIX} Email verification sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending email verification:`, error);
    throw error;
  }
};

export const sendAccountRecoveryInstructions = async (to: string, recoveryLink: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending account recovery instructions to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/account-recovery`);
    console.log(`${LOG_PREFIX} Request content:`, { to, recoveryLink });
    const response = await api.post('/api/email/account-recovery', { to, recoveryLink });
    console.log(`${LOG_PREFIX} Account recovery instructions sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending account recovery instructions:`, error);
    throw error;
  }
};

export const sendLessonReminder = async (to: string, studentName: string, teacherName: string, date: string, time: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending lesson reminder to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/lesson-reminder`);
    console.log(`${LOG_PREFIX} Request content:`, { to, studentName, teacherName, date, time });
    const response = await api.post('/api/email/lesson-reminder', { to, studentName, teacherName, date, time });
    console.log(`${LOG_PREFIX} Lesson reminder sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending lesson reminder:`, error);
    throw error;
  }
};

export const sendLessonCancellationNotice = async (to: string, studentName: string, date: string, time: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending lesson cancellation notice to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/lesson-cancellation`);
    console.log(`${LOG_PREFIX} Request content:`, { to, studentName, date, time });
    const response = await api.post('/api/email/lesson-cancellation', { to, studentName, date, time });
    console.log(`${LOG_PREFIX} Lesson cancellation notice sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending lesson cancellation notice:`, error);
    throw error;
  }
};

export const sendPaymentConfirmation = async (to: string, customerName: string, amount: number, date: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending payment confirmation to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/payment-confirmation`);
    console.log(`${LOG_PREFIX} Request content:`, { to, customerName, amount, date });
    const response = await api.post('/api/email/payment-confirmation', { to, customerName, amount, date });
    console.log(`${LOG_PREFIX} Payment confirmation sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending payment confirmation:`, error);
    throw error;
  }
};

export const sendContactFormSubmission = async (name: string, email: string, message: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending contact form submission for:`, name);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/contact-form`);
    console.log(`${LOG_PREFIX} Request content:`, { name, email, message });
    const response = await api.post('/api/email/contact-form', { name, email, message });
    console.log(`${LOG_PREFIX} Contact form submission sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending contact form submission:`, error);
    throw error;
  }
};
export const sendWelcomeEmailWithCourseDetails = async (
  to: string,
  name: string,
  email: string,
  temporaryPassword: string,
  courseName: string,
  courseStartDate: string,
  verificationToken: string,
  verificationCode: string
): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending welcome email with course details to:`, to);
  try {
    await ensureCsrfToken();
    console.log(`${LOG_PREFIX} Request path: /api/email/welcome-with-course`);
    console.log(`${LOG_PREFIX} Request content:`, { 
      to, 
      name, 
      email, 
      temporaryPassword, 
      courseName, 
      courseStartDate,
      verificationToken,
      verificationCode
    });
    const response = await api.post('/api/email/welcome-with-course', { 
      to, 
      name, 
      email, 
      temporaryPassword, 
      courseName, 
      courseStartDate,
      verificationToken,
      verificationCode
    });
    console.log(`${LOG_PREFIX} Welcome email with course details sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending welcome email with course details:`, error);
    throw error;
  }
};

export default {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendCoursePurchaseConfirmation,
  sendEmailVerification,
  sendAccountRecoveryInstructions,
  sendLessonReminder,
  sendLessonCancellationNotice,
  sendPaymentConfirmation,
  sendContactFormSubmission,
  sendWelcomeEmailWithCourseDetails,
  sendCourseWelcomeEmail
};