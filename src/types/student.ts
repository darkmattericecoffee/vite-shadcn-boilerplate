// src/types/student.ts
export interface Class {
    id: string;
    name: string;
  }
  
  export interface Student {
    id: string;
    name: string;
    class?: Class;
    graduationYear?: string; // This will be the enum value like "year_2025"
  }
  
  // Helper function to format the graduation year enum for display
  export function formatGraduationYear(graduationYearEnum: string | undefined): string {
    if (!graduationYearEnum) return 'N/A';
    
    // Extract the numeric year from the enum value
    const yearMatch = graduationYearEnum.match(/year_(\d{4})/);
    if (yearMatch && yearMatch[1]) {
      return yearMatch[1];
    }
    
    // If the format doesn't match, just return the original value
    return graduationYearEnum;
  }