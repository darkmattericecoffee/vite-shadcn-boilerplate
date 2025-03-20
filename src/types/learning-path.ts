// src/types/learning-path.ts

import { Assignment } from './assignment';

export interface LearningPathAssignment {
  id: string;
  title: string;
  description?: {
    document: any;
  };
  dueDate?: string;
  orderInPath?: number;
  screenshots?: {
    id: string;
    caption?: string;
    image?: {
      url: string;
      width?: number;
      height?: number;
    };
  }[];
}

export interface LearningPath {
  id: string;
  title: string;
  description?: {
    document: any;
  };
  coverImage?: {
    url: string;
    width?: number;
    height?: number;
  };
  createdAt?: string;
  createdBy?: {
    name: string;
  };
  assignments?: LearningPathAssignment[];
  projects?: Project[];
}

export interface Project {
  id: string;
  title: string;
  description?: {
    document: any;
  };
  student: {
    id: string;
    name: string;
    class?: string;
  };
  deliverableType?: string;
  screenshots?: {
    id: string;
    caption?: string;
    image?: {
      url: string;
      width?: number;
      height?: number;
    };
  }[];
}