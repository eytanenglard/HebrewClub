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
  username: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  dateOfBirth?: Dayjs;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  isEmailVerified: boolean;
  lastLogin: Dayjs;
  status: 'active' | 'inactive' | 'locked';
  completedLessons: string[];
  progress: { [courseId: string]: number };
  courseEnrollments: CourseEnrollment[];
  certificates: Certificate[];
  preferences: UserPreferences;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface UserPreferences {
  language: string;
  emailNotifications: boolean;
  darkMode: boolean;
}

// Course related types
export interface Course {
  _id: string;
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
  language: string;
  tags: string[];
  rating: number;
  enrollmentCount: number;
  thumbnail?: string;
  videoUrl?: string;
  learningObjectives: string[];
  estimatedCompletionTime: number;
  certificationOffered: boolean;
  prerequisiteCourses?: string[];
  sections: Section[];
}

export interface Section {
  _id: string;
  title: string;
  description: string;
  order: number;
  isOptional?: boolean;
  estimatedCompletionTime: number;
  learningObjectives: string[];
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  order: number;
  isOptional?: boolean;
  sectionId: string;
  learningObjectives: string[];
  estimatedCompletionTime: number;
  type: 'video' | 'text' | 'interactive' | 'live-session';
  liveSessionDate?: Dayjs;
  contentItems: ContentItem[];
}

export interface ContentItem {
  _id: string;
  type: 'text' | 'video' | 'audio' | 'interactive' | 'quiz' | 'document' | 'link' | 'code-snippet' | 'youtube';
  title: string;
  description: string;
  data: string;
  duration?: number;
  order: number;
  transcriptUrl?: string;
  captionsUrl?: string;
}
export interface Lead {
  courseId: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  courseInterest: string[];
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  notes: string;
  paymentOption?: 'full' | 'installments';
  enrollmentDate?: Date;
  paymentCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadData {
  courseId: string;
  courseInterest: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  paymentOption?: 'full' | 'installments';
  enrollmentDate?: Date;
  notes?: string;
}
export interface CourseEnrollment {
  courseId: string;
  courseTitle: string;
  description: string;
  learningObjectives?: string[];
  category?: string;
  instructors?: string[];
  duration?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: string;
  startDate?: string;
  endDate?: string;
  language?: string;
  tags?: string[];
  rating?: number;
  enrollmentCount?: number;
  thumbnail?: string;
  videoUrl?: string;
  estimatedCompletionTime?: number;
  prerequisiteCourses?: string[];
  Syllabus?: any[]; 
  icon: string;
  features: string[];
  options: string[];
  ageGroup: string;
  format: string;
  recommended?: boolean;
}


export interface Certificate {
  courseId: string;
  issueDate: Dayjs;
  certificateUrl: string;
}

// Quiz related types
export interface Quiz {
  _id: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: QuizQuestion[];
  lessonId: string;
}

export interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface QuizAttempt {
  _id: string;
  userId: string;
  quizId: string;
  answers: number[];
  score: number;
  timeTaken: number;
  completedAt: Dayjs;
}

// Assignment related types
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: Dayjs;
  maxScore: number;
  lessonId: string;
}

// Discussion related types
export interface Discussion {
  _id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  content: string;
  author: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  replies: DiscussionReply[];
  isPinned: boolean;
  isResolved: boolean;
}

export interface DiscussionReply {
  _id: string;
  discussionId: string;
  content: string;
  author: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  isInstructorReply: boolean;
}

// Bookmark related types
export interface Bookmark {
  _id: string;
  userId: string;
  lessonId: string;
  time: number;
  label: string;
}

// Notification related types
export interface Notification {
  _id: string;
  userId: string;
  type: 'course_update' | 'assignment_due' | 'grade_posted' | 'forum_reply' | 'system';
  content: string;
  isRead: boolean;
  createdAt: Dayjs;
}

// Progress tracking related types
export interface ProgressTracker {
  userId: string;
  courseId: string;
  lessonId: string;
  completedContentItems: string[];
  quizScores: { [quizId: string]: number };
  lastAccessedAt: Dayjs;
}

// Review related types
export interface Review {
  _id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

// Wishlist related types
export interface Wishlist {
  _id: string;
  userId: string;
  courses: string[];
}

// Cart related types
export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export interface CartItem {
  courseId: string;
  price: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// Login Response type
export interface LoginResponse {
  token: string;
  user: User;
}