// src/components/layout/UpcomingHolidaysSidebar.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UmbrellaIcon,
  CalendarDaysIcon,
  CalendarIcon,
  BookOpenIcon,
  LayersIcon
} from 'lucide-react';
import { 
  getUpcomingHolidays, 
  formatHolidayDate,
  Holiday,
  isDateInHoliday
} from '@/utils/holidayUtils';
import { getAssignments } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface Assignment {
  id: string;
  title: string;
  dueDate?: string;
  dueDateObj?: Date;
  learningPath?: {
    id: string;
    title: string;
  };
}

const UpcomingHolidaysSidebar = () => {
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);
  const [nextDeadline, setNextDeadline] = useState<Assignment | null>(null);
  const [currentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  // Check if current date is in a holiday
  const currentHoliday = isDateInHoliday(currentDate);

  // Helper function to get color for learning path
  const getLearningPathColor = (title: string): string => {
    const colors = [
      'bg-pink-500',
      'bg-purple-500',
      'bg-blue-500',
      'bg-cyan-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-red-500',
    ];
    
    // Simple hash function to map title to a color
    const hash = title.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get upcoming holidays
        const upcoming = getUpcomingHolidays(currentDate, 4);
        setUpcomingHolidays(upcoming);
        
        // Fetch assignments to find next deadline
        const assignmentsData = await getAssignments();
        
        // Process assignments to add date objects
        const processedAssignments: Assignment[] = assignmentsData.assignments.map((assignment: Assignment) => {
          let dueDateObj = undefined;
          if (assignment.dueDate) {
            dueDateObj = new Date(assignment.dueDate);
          }
          
          return {
            ...assignment,
            dueDateObj
          };
        });
        
        // Find the next upcoming assignment
        const upcomingAssignments = processedAssignments
          .filter(a => a.dueDateObj && a.dueDateObj > currentDate)
          .sort((a, b) => (a.dueDateObj!.getTime() - b.dueDateObj!.getTime()));
        
        setNextDeadline(upcomingAssignments.length > 0 ? upcomingAssignments[0] : null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentDate]);

  if (loading) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (upcomingHolidays.length === 0 && !nextDeadline) return null;

  return (
    <div className="space-y-4">
      {/* Current date indicator */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <div className="flex items-center">
          <div className="mr-3 h-4 w-4 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium">Vandaag: {currentDate.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</span>
        </div>
        {currentHoliday && (
          <div className="mt-2 flex items-center text-sm">
            <div
              className="mr-3 h-3 w-3 rounded-full"
              style={{ backgroundColor: currentHoliday.color }}
            ></div>
            <span>Momenteel: {currentHoliday.name}</span>
          </div>
        )}
      </div>
      
      {/* Next deadline section */}
      {nextDeadline && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-purple-50">
            <h3 className="text-lg font-semibold flex items-center text-purple-900">
              <CalendarIcon className="mr-2" size={18} />
              Aanstaande deadline
            </h3>
          </div>
          <div className="p-4">
            <Link to={`/assignments/${nextDeadline.id}`} className="block">
              <div className="mb-2">
                <div className="flex items-center mb-1">
                  <BookOpenIcon size={16} className="mr-2 text-purple-700" />
                  <span className="font-medium">{nextDeadline.title}</span>
                </div>
                {nextDeadline.learningPath && (
                  <Badge className={`flex w-fit items-center gap-1 ${getLearningPathColor(nextDeadline.learningPath.title)} text-white`}>
                    <LayersIcon size={12} />
                    {nextDeadline.learningPath.title}
                  </Badge>
                )}
              </div>
              <Badge variant="default" className="bg-purple-500 mt-2 flex items-center gap-1 w-fit">
                <CalendarIcon size={12} />
                {nextDeadline.dueDateObj?.toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Badge>
            </Link>
          </div>
        </div>
      )}

      {/* Upcoming holidays section */}
      {upcomingHolidays.length > 0 && (
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold flex items-center">
              <CalendarDaysIcon className="mr-2" size={18} />
              Aankomende vakanties
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {upcomingHolidays.map(holiday => (
                <div 
                  key={holiday.name} 
                  className="flex flex-col px-3 py-2 rounded-md"
                  style={{ backgroundColor: holiday.color }}
                >
                  <div className="flex items-center mb-1">
                    <UmbrellaIcon size={14} className="mr-2" />
                    <span className="font-medium">{holiday.name}</span>
                  </div>
                  <span className="text-sm">
                    {formatHolidayDate(holiday.startDate)} - {formatHolidayDate(holiday.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { UpcomingHolidaysSidebar };