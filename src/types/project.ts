// src/types/project.ts
import { Assignment } from './assignment';

export interface Project {
  id: string;
  title: string;
  description?: {
    document: any[];
  };
  submissionDate?: string;
  createdAt: string;
  demoUrl?: string;
  embedCode?: string;
  link?: string | null;
  student: {
    id: string;
    name: string;
    class?: string;
    graduationYear?: number;
  };
  assignment?: {
    id: string;
    title: string;
    description?: {
      document: any[];
    };
  };
  languages: Array<{
    id: string;
    name: string;
  }>;
  projectType: string;
  learningPath?: {
    id: string;
    title: string;
    description?: {
      document: any[];
    };
    coverImage?: {
      url: string;
      width?: number;
      height?: number;
    };
    createdAt?: string;
    assignments?: Array<{
      id: string;
      title: string;
      orderInPath?: number;
    }>;
  };
  screenshots?: Array<{
    id?: string;
    image?: {
      url: string;
      width?: number;
      height?: number;
      filesize?: number;
    };
    caption?: string;
  }>;
  files?: Array<{
    id?: string;
    file?: {
      url: string;
      filename: string;
    };
    title?: string;
    description?: string;
    fileType?: string;
  }>;
  codeFiles?: Array<{
    id?: string;
    description?: string;
    file?: {
      filename: string;
      url: string;
      filesize: number;
    };
  }>;
  zipArchives?: Array<{
    id?: string;
    description?: string;
    archive?: {
      filename: string;
      url: string;
      filesize: number;
    };
    extractedPath?: string;
  }>;
  featured?: boolean;
}