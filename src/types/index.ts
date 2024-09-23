export interface Bookmark {
    id: string;
    time: number;
    label: string;
  }
  
  export interface Lesson {
    id: string;
    title: string;
    videoUrl: string;
    completed: boolean;
    bookmarks: Bookmark[];
  }
  
  export interface Chapter {
    id: string;
    title: string;
    lessons: Lesson[];
  }
  
  export interface Course {
    _id: string;
    duration: string;
    title: string;
    level: string;
    estimatedCompletionTime: number;
    description: string;
    instructors: string[];
    chapters: Chapter[];
  }