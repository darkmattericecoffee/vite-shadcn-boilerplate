// src/services/holiday-service.ts
import schoolHolidays from '../assets/dutch-school-holidays.json';

export interface Holiday {
  name: string;
  region: string;
  startDate: Date;
  endDate: Date;
  color: string;
}

// A map of holiday types to colors
const holidayColors: Record<string, string> = {
    'Kerstvakantie': '#fadee1', // Light red for Christmas
    'Voorjaarsvakantie': '#e1f8e7', // Very light green for Spring
    'Meivakantie': '#fce8ef', // Very light pink for May
    'Zomervakantie': '#fff8dd', // Very light yellow for Summer
    'Herfstvakantie': '#fbecd7'  // Very light orange for Fall
  };

export function getHolidayColor(holidayName: string): string {
  // Check which holiday type this is and return the appropriate color
  for (const [key, value] of Object.entries(holidayColors)) {
    if (holidayName.includes(key)) {
      return value;
    }
  }
  // Default color if no match is found
  return '#d1d5db'; // gray-300
}

export function getSchoolHolidays(): Holiday[] {
  // Process the JSON data and convert string dates to Date objects
  return schoolHolidays.holidays.map(holiday => ({
    ...holiday,
    startDate: new Date(holiday.startDate),
    endDate: new Date(holiday.endDate),
    color: getHolidayColor(holiday.name)
  }));
}

export function getUpcomingHolidays(currentDate: Date, limit: number = 3): Holiday[] {
  const holidays = getSchoolHolidays();
  
  // Sort holidays by start date and filter to get upcoming ones
  return holidays
    .filter(holiday => holiday.startDate >= currentDate)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, limit);
}

export function isDateInHoliday(date: Date): Holiday | null {
  const holidays = getSchoolHolidays();
  
  for (const holiday of holidays) {
    if (date >= holiday.startDate && date <= holiday.endDate) {
      return holiday;
    }
  }
  
  return null;
}

export function getHolidaysBetweenDates(startDate: Date, endDate: Date): Holiday[] {
  const holidays = getSchoolHolidays();
  
  // Find holidays that overlap with the given date range
  return holidays.filter(holiday => 
    // Holiday starts within the range
    (holiday.startDate >= startDate && holiday.startDate <= endDate) ||
    // Holiday ends within the range
    (holiday.endDate >= startDate && holiday.endDate <= endDate) ||
    // Holiday completely covers the range
    (holiday.startDate <= startDate && holiday.endDate >= endDate)
  );
}

export function formatHolidayDate(date: Date): string {
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short'
  });
}



