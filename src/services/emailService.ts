import api from './api';

const LOG_PREFIX = '[emailService.ts]';

export const sendWelcomeEmail = async (to: string, name: string, temporaryPassword: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending welcome email to:`, to);
  try {
    const response = await api.post('/api/email/welcome', { to, name, temporaryPassword });
    console.log(`${LOG_PREFIX} Welcome email sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending welcome email:`, error);
    throw error;
  }
};

export const sendCourseWelcomeEmail = async (to: string, userName: string, courseName: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending course welcome email to:`, to);
  try {
    const response = await api.post('/api/email/course-welcome', { to, userName, courseName });
    console.log(`${LOG_PREFIX} Course welcome email sent successfully`);
    return response.data.success;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error sending course welcome email:`, error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (to: string, resetToken: string): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending password reset email to:`, to);
  try {
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
): Promise<boolean> => {
  console.log(`${LOG_PREFIX} Sending welcome email with course details to:`, to);
  try {
    const response = await api.post('/api/email/welcome-with-course', { 
      to, 
      name, 
      email, 
      temporaryPassword, 
      courseName, 
      courseStartDate,
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
  sendCourseWelcomeEmail,
  sendPasswordResetEmail,
  sendCoursePurchaseConfirmation,
  sendEmailVerification,
  sendAccountRecoveryInstructions,
  sendLessonReminder,
  sendLessonCancellationNotice,
  sendPaymentConfirmation,
  sendContactFormSubmission,
  sendWelcomeEmailWithCourseDetails
};