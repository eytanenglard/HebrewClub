import { Dayjs } from 'dayjs';

// User related types
export interface UserRole {
  name: 'user' | 'admin' | 'moderator' | 'instructor';
  permissions: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  username: string;
  password: string;
  role: UserRole;
  groups: string[];
  courses: string[];
  completedLessons: string[];
  progress: { [courseId: string]: number };
  dateOfBirth?: Date | string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  twoFactorEnabled: boolean;
  isEmailVerified: boolean;
  status: 'active' | 'inactive' | 'locked';
  failedLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  twoFactorSecret?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  facebookId?: string;
  emailVerificationToken?: string;
  jwtSecret?: string;
  lastLogin?: Date;
  lockUntil?: Date;
  avatar?: string;
  emailVerificationExpires?: Date;
  emailVerificationCode?: string; 
  pendingCourseId?: string; 
}
export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  error?: string;
}
export interface EmailVerificationRequest {
  token?: string;
  code?: string;
}
export interface UserData {
  name: string;
  email: string;
  phone?: string;
  username: string;
  password: string;
  courses?: string[]
  role: UserRole;
  dateOfBirth?: Date | string ; 
  avatar?: string;
  status: 'active' | 'inactive' | 'locked';
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  username: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  dateOfBirth?: Date; 
  address?: string;
  city?: string;
  country?: string;
  groups: string[];
}
export interface EditableUserProfile {
  _id?: string;
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  twoFactorEnabled?: boolean;
  isEmailVerified?: boolean;
  status?: 'active' | 'inactive' | 'locked';
  failedLoginAttempts?: number;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  usersByRole: { [key: string]: number };
}

export interface UserActivity {
  userId: string;
  action: string;
  timestamp: Dayjs;
  details: any;
}
export interface UserResponse {
  success: boolean;
  user: User;
  token?: string;
}
export interface InstructorInfo {
  _id: string;
  name: string;
  userId: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface CourseEnrollment {
  courseId: string;
  enrollmentDate: Dayjs;
  completionDate?: Dayjs;
  progress: number;
  status: 'active' | 'completed' | 'dropped';
  grade?: number;
}

export interface Certificate {
  courseId: string;
  issueDate: Dayjs;
  certificateUrl: string;
}

export interface UserPreferences {
  language: string;
  emailNotifications: boolean;
  darkMode: boolean;
}

// Course related types
export interface Course {
  _id: object; 
  courseId: string;
  title: string;
  description: string;
  category: string;
  instructors: string[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  startDate: Dayjs;
  endDate: Dayjs;
  maxParticipants: number;
  status: 'active' | 'inactive' | 'full' | 'draft' | 'archived';
  prerequisites: string[];
  tags: string[];
  users: string[];
  completionRate: number;
  sections: string[];
  rating: number;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  icon?: string;
  features: string[];
  options: string[];
  recommended: boolean;
  videoUrl?: string;
  downloadUrl?: string;
  thumbnail?: string;
  syllabus: string;
  learningObjectives: string[];
  estimatedCompletionTime: number;
  language: string;
  certificationOffered: boolean;
  enrollmentDeadline?: Dayjs;
  refundPolicy?: string;
  discussionForumEnabled: boolean;
  allowGuestPreview: boolean;
  courseFormat: 'online' | 'blended' | 'in-person' | 'live';
  nextStartDate?: Dayjs;
  prerequisiteCourses?: string[];
  ageGroup: string;
  minParticipants: number;
  courseType: 'recorded' | 'live';
  possibleStartDates?: Dayjs[];
  enrollmentCount: number;
}

export interface CourseData {
  title: string;
  description: string;
  category: string;
  instructors: string[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  price: number;
  startDate: Dayjs | string;
  endDate: Dayjs | string;
  maxParticipants: number;
  status: 'active' | 'inactive' | 'full' | 'draft' | 'archived';
  prerequisites: string[];
  tags: string[];
  icon?: string;
  features: string[];
  options: string[];
  recommended: boolean;
  videoUrl?: string;
  downloadUrl?: string;
  thumbnail?: string;
  syllabus: string;
  learningObjectives: string[];
  estimatedCompletionTime: number;
  certificationOffered: boolean;
  enrollmentDeadline?: Dayjs;
  refundPolicy?: string;
  discussionForumEnabled: boolean;
  allowGuestPreview: boolean;
  courseFormat: 'online' | 'blended' | 'in-person' | 'live';
  nextStartDate?: Dayjs;
  prerequisiteCourses?: string[];
  ageGroup: string;
  minParticipants: number;
  courseType: 'recorded' | 'live';
  possibleStartDates?: Dayjs[];
}

export interface Section {
  _id: string;
  title: string;
  description: string;
  lessons: string[];
  courseId: string;
  order: number;
  isOptional?: boolean;
  learningObjectives: string[];
  estimatedCompletionTime: number;
  unlockDate?: Dayjs;
  quizzes: string[];
  assignments: string[];
}

export interface SectionData {
  title: string;
  description: string;
  order: number;
  isOptional?: boolean;
  courseId: string;
  learningObjectives: string[];
  estimatedCompletionTime: number;
  unlockDate?: Dayjs;
}

export interface ContentItem {
  _id: string;
  type: 'text' | 'video' | 'audio' | 'interactive' | 'quiz' | 'document' | 'link' | 'code-snippet' | 'youtube';
  title: string;
  description: string;
  data: string;
  duration?: number;
  size?: number;
  fileType?: string;
  order: number;
  tags: string[];
  version: string;
  lastUpdated: Dayjs;
  lessonId: string;
  transcriptUrl?: string;
  captionsUrl?: string;
  interactivityType?: 'poll' | 'quiz' | 'discussion';
}

export interface ContentItemData {
  type: 'text' | 'video' | 'audio' | 'interactive' | 'quiz' | 'document' | 'link' | 'code-snippet';
  title: string;
  description: string;
  data: string;
  duration?: number;
  size?: number;
  fileType?: string;
  order: number;
  tags: string[];
  version: string;
  lessonId: string;
  transcriptUrl?: string;
  captionsUrl?: string;
  interactivityType?: 'poll' | 'quiz' | 'discussion';
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  contentItems: string[];
  order: number;
  isOptional?: boolean;
  sectionId: string;
  learningObjectives: string[];
  assignments: string[];
  estimatedCompletionTime: number;
  type: 'video' | 'text' | 'interactive' | 'live-session';
  liveSessionDate?: Dayjs;
  prerequisiteLessons?: string[];
  nextLessonId?: string;
  previousLessonId?: string;
}

export interface LessonData {
  title: string;
  description: string;
  order: number;
  isOptional?: boolean;
  sectionId: string;
  learningObjectives: string[];
  assignments: string[];
  estimatedCompletionTime: number;
  type: 'video' | 'text' | 'interactive' | 'live-session';
  liveSessionDate?: Dayjs;
  prerequisiteLessons?: string[];
}

export interface Quiz {
  _id: string;
  title: string;
  questions: string[];
  lessonId: string;
}

export interface QuizData {
  title: string;
  lessonId: string;
}

export interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  quizId: string;
}

export interface QuizQuestionData {
  question: string;
  options: string[];
  correctAnswer: number;
  quizId: string;
}

export interface PopulatedCourse extends Omit<Course, 'instructors' | 'users' | 'sections'> {
  instructors: User[];
  users: User[];
  sections: Section[];
}

export interface PopulatedLessonfull extends Omit<Lesson, 'contentItems'> {
  contentItems: ContentItem[];
}
export interface PopulatedSectionfull extends Omit<Section, 'lessons'> {
  lessons: PopulatedLessonfull[];
}
export interface PopulatedCoursefull extends Omit<Course, 'sections'> {
  sections: PopulatedSectionfull[];
}

// Assignment related types
export interface Assignment {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Dayjs;
  maxScore: number;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface AssignmentData {
  courseId: string;
  title: string;
  description: string;
  dueDate: Dayjs;
  maxScore: number;
}

// Payment related types
export interface Payment {
  _id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: Dayjs;
}

export interface PaymentData {
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

// Lead related types
export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  courseInterest: string[];
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  notes: string;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
  paymentOption?: 'full' | 'installments';
  promoCode? : string;
  paymentCompleted?: boolean;

}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  courseInterest: string[];
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  notes?: string;
  paymentOption?: 'full' | 'installments';
  promoCode? : string;
}

// Group related types
export interface Group {
  _id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface GroupData {
  name: string;
  description: string;
  members: string[];
}

// Settings related types
export interface SystemSettings {
  _id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maxUploadSize: number;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  updatedAt: Dayjs;
}

export interface SystemSettingsData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maxUploadSize: number;
  allowRegistration: boolean;
  maintenanceMode: boolean;
}

// Permission related types
export interface Permission {
  _id: string;
  name: string;
  description: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface PermissionData {
  name: string;
  description: string;
}

// Role related types
export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface RoleData {
  name: string;
  description: string;
  permissions: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  token?: string | null;
  user?: T | null;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  data: T;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// Login Response type
export interface LoginResponse {
  success: boolean;
  token: string | null;
  user: User | null;
  error?: string;
}

export interface UserManagementData {
  users: User[];
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: { [key: string]: number };
  recentlyCreatedUsers: User[];
  recentlyUpdatedUsers: User[];
}

export type CourseWithStringInstructors = Omit<Course, 'instructors' | 'users'> & { 
  instructors: string[];
  users: string[];
};

// Coupon related types
export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: Dayjs;
  validUntil: Dayjs;
  maxUses: number;
  currentUses: number;
  applicableCourses: string[];
}

export interface CouponData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: Dayjs;
  validUntil: Dayjs;
  maxUses: number;
  applicableCourses: string[];
}

