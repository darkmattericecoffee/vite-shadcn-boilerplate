// src/types/learning-path.ts
type Document = any;
export interface LearningObjective {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface LearningPathAssignment {
  id: string;
  title: string;
  description?: {
    document: Document;
  };
  learningObjectives?: LearningObjective[];
  dueDate?: string;
  orderInPath?: number;
  screenshots?: {
    id: string;
    caption?: string;
    image?: {
      url: string;
      width: number;
      height: number;
    };
  }[];
}

export interface Project {
  id: string;
  title: string;
  student: {
    id: string;
    name: string;
    class?: string;
  };
  screenshots?: {
    image?: {
      url: string;
    };
  }[];
  deliverableType?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description?: {
    document: Document;
  };
  learningObjectives?: LearningObjective[];
  coverImage?: {
    url: string;
    width: number;
    height: number;
  };
  createdAt?: string;
  createdBy?: {
    name: string;
  };
  assignments?: LearningPathAssignment[];
  projects?: Project[];
}