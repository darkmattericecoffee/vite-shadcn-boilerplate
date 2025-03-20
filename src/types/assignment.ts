// src/types/assignment.ts

export interface Assignment {
    id: string;
    title: string;
    description?: {
      document: any;
    };
    dueDate?: string;
    files?: Array<{
      id: string;
      title?: string;
      description?: string;
      fileType?: string;
      file?: {
        filename: string;
        url: string;
        filesize?: number;
      };
    }>;
    screenshots?: Array<{
      id: string;
      caption?: string;
      image?: {
        url: string;
        width?: number;
        height?: number;
        filesize?: number;
      };
    }>;
    projects?: Array<{
      id: string;
      title: string;
      description?: {
        document: any;
      };
      student: {
        name: string;
        class?: string;
      };
      screenshots?: Array<{
        image?: {
          url: string;
        };
      }>;
    }>;
  }