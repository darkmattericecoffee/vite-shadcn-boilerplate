// src/components/timeline/TimelineSidebar.tsx
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapIcon, UmbrellaIcon } from 'lucide-react';
import { Holiday } from '@/utils/holidayUtils';

interface LearningPathSummary {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  durationWeeks: number;
  color: string;
}

interface TimelineSidebarProps {
  learningPaths: LearningPathSummary[];
  holidays: Holiday[];
  currentDate: Date;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long'
  });
};

const formatCompactDate = (date: Date): string => {
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short'
  });
};

export const TimelineSidebar = ({ learningPaths, holidays, currentDate }: TimelineSidebarProps) => {
  // Sort learning paths by start date
  const sortedPaths = [...learningPaths].sort((a, b) =>
    a.startDate.getTime() - b.startDate.getTime()
  );

  // Get upcoming holidays (max 3)
  const upcomingHolidays = holidays
    .filter(holiday => holiday.startDate >= currentDate)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 3);

  return (
    <aside className="w-64 lg:w-72 flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900">
      <div className="p-5 h-full overflow-auto">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <MapIcon size={18} className="mr-2 text-primary" />
          Leerpaden Overzicht
        </h3>
        
        <div className="space-y-4">
          {sortedPaths.map(path => (
            <div 
              key={path.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div 
                className="h-1.5" 
                style={{ backgroundColor: path.color }}
              ></div>
              <div className="p-4">
                <Link
                  to={`/learning-paths/${path.id}`}
                  className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary flex items-center mb-3"
                >
                  <span className="truncate">{path.title}</span>
                </Link>
                <div className="flex items-center space-x-2 mb-3">
                  <span 
                    className="px-2 py-0.5 text-xs rounded-full text-white flex-shrink-0" 
                    style={{ backgroundColor: path.color }}
                  >
                    Leerpad
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500 text-white flex-shrink-0">
                    Deadline: {formatCompactDate(path.endDate)}
                  </span>
                </div>
                
                <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <CalendarIcon size={14} className="mr-2 text-gray-400" />
                    <div className="flex justify-between w-full">
                      <span>Start:</span>
                      <span className="font-medium">{formatCompactDate(path.startDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ClockIcon size={14} className="mr-2 text-gray-400" />
                    <div className="flex justify-between w-full">
                      <span>Duur:</span>
                      <span className="font-medium">
                        {path.durationWeeks} {path.durationWeeks === 1 ? 'week' : 'weken'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {upcomingHolidays.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <UmbrellaIcon size={18} className="mr-2 text-primary" />
              Aankomende vakanties
            </h3>
            
            <div className="space-y-3">
              {upcomingHolidays.map(holiday => (
                <div
                  key={holiday.name}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">{holiday.name}</div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span 
                        className="px-2 py-0.5 text-xs rounded-full text-white flex-shrink-0" 
                        style={{ backgroundColor: holiday.color }}
                      >
                        Vakantie
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <CalendarIcon size={14} className="mr-2 text-gray-400" />
                      <span>
                        {formatCompactDate(holiday.startDate)} - {formatCompactDate(holiday.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};