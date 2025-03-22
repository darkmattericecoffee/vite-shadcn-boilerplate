// src/utils/yearUtils.ts

/**
 * Converts a year string in format "year_XXXX" to a number
 * @param yearString - The year string to convert (e.g. "year_2025")
 * @returns The extracted year as a number (e.g. 2025), or null if invalid format
 */
export const extractYearFromString = (yearString: string | null | undefined): number | null => {
    if (!yearString) return null;
    
    const match = yearString.match(/year_(\d{4})/);
    return match ? parseInt(match[1], 10) : null;
  };
  
  /**
   * Formats a year number to the "year_XXXX" format
   * @param year - The year number to format
   * @returns The formatted year string (e.g. "year_2025")
   */
  export const formatYearToString = (year: number | null | undefined): string | null => {
    if (!year) return null;
    return `year_${year}`;
  };