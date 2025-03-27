// src/types/project.ts
// Using the Document type from assignment or create it here
type Document = any;

export interface ProjectFile {
  id: string;
  description?: string;
  title?: string;
  fileType?: string;
  file?: {
    filename: string;
    url: string;
    filesize: number;
  };
}

export interface CodeFile {
  id: string;
  description?: string;
  file: {
    filename: string;
    url: string;
    filesize?: number;
  };
}

export interface ProjectScreenshot {
  id: string;
  caption?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    filesize?: number;
  };
}

export interface ProjectZipArchive {
  id: string;
  name?: string;
  description?: string;
  extractedPath?: string;
  archive?: {
    filename: string;
    url: string;
    filesize: number;
  };
}

export interface Project {
  id: string;
  title: string;
  description?: {
    document: Document;
  };
  projectType?: string;
  deliverableType?: string;
  demoUrl?: string;
  embedCode?: string;
  link?: string;
  featured?: boolean;
  createdAt?: string;
  submissionDate?: string;
  
  // Updated to support multiple students
  students?: {
    id: string;
    name: string;
    class?: {
      id?: string;
      name: string;
    };
    graduationYear?: string;
  }[];
  
  // Keep old student property for backward compatibility
  student?: {
    id: string;
    name: string;
    class?: string;
    graduationYear?: string;
  };
  
  assignment?: {
    id: string;
    title: string;
    description?: {
      document: Document;
    };
    learningObjectives?: {
      id: string;
      title: string;
      description?: string;
      order?: number;
    }[];
  };
  
  learningPath?: {
    id: string;
    title: string;
    description?: {
      document: Document;
    };
    assignments?: {
      id: string;
      title: string;
      orderInPath?: number;
      learningObjectives?: {
        id: string;
        title: string;
        description?: string;
        order?: number;
      }[];
    }[];
  };
  
  languages?: {
    id: string;
    name: string;
  }[];
  
  screenshots?: ProjectScreenshot[];
  files?: ProjectFile[];
  codeFiles?: CodeFile[]; // Added codeFiles property
  zipArchives?: ProjectZipArchive[];
}