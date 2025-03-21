// src/types/assignment.ts
// Using the Document type from the learning-path types
type Document = any;
import { LearningObjective } from "./learning-path";

export interface AssignmentFile {
  id: string;
  title?: string;
  description?: string;
  fileType?: string;
  file?: {
    filename: string;
    url: string;
    filesize: number;
  };
}

export interface AssignmentScreenshot {
  id: string;
  caption?: string;
  image?: {
    url: string;
    width: number;
    height: number;
    filesize?: number;
  };
}

// Updated to support multiple students
export interface AssignmentProject {
  id: string;
  title: string;
  deliverableType?: string;
  description?: {
    document: Document;
  };
  // Keep the old student property for backward compatibility
  student?: {
    name: string;
    class?: string;
  };
  // Add the new students array property
  students?: {
    id: string;
    name: string;
    class?: {
      id?: string;
      name: string;
    };
  }[];
  screenshots?: {
    image?: {
      url: string;
    };
  }[];
}

export interface Assignment {
  id: string;
  title: string;
  description?: {
    document: Document;
  };
  learningObjectives?: LearningObjective[];
  dueDate?: string;
  orderInPath?: number;
  learningPath?: {
    id: string;
    title: string;
    assignments?: {
      id: string;
      title: string;
      orderInPath?: number;
    }[];
  };
  files?: AssignmentFile[];
  screenshots?: AssignmentScreenshot[];
  projects?: AssignmentProject[];
}