// src/pages/TimelinePage.tsx - With holidays
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments, getLearningPaths, getFullUrl } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ChevronRightIcon, 
  FilterIcon,
  LayersIcon,
  ArrowRightIcon,
  UmbrellaIcon,
  CalendarDaysIcon,
  InfoIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  getSchoolHolidays, 
  getUpcomingHolidays, 
  isDateInHoliday, 
  formatHolidayDate,
  getHolidaysBetweenDates,
  Holiday
} from '@/utils/holidayUtils';

// Type definitions
interface Screenshot {
  id: string;
  caption?: string;
  image: {
    url: string;
    width?: number;
    height?: number;
    filesize?: number;
  };
}

interface LearningPath {
  id: string;
  title: string;
  assignments?: Assignment[];
  earliestDeadline?: Date;
  latestDeadline?: Date;
  coverImage?: {
    url: string;
  };
}

interface Assignment {
  id: string;
  title: string;
  description?: {
    document: any;
  };
  dueDate?: string;
  formattedDueDate?: string;
  dueDateObj?: Date;
  screenshots?: Screenshot[];
  learningPath?: {
    id: string;
    title: string;
  };
  orderInPath?: number;
}

interface TimelineItem {
  type: 'assignment' | 'learningPath' | 'learningPathStart';
  id: string;
  title: string;
  date: Date;
  learningPathId?: string;
  learningPathTitle?: string;
  screenshots?: Screenshot[];
  isPast: boolean;
  isUpcoming: boolean; // New property to highlight next deadline
  orderInPath?: number;
}

interface LearningPathTimelineGroup {
  learningPath: {
    id: string;
    title: string;
    coverImage?: {
      url: string;
    };
  };
  startDate: Date;
  endDate: Date;
  assignments: Assignment[];
  isPast: boolean;
  holidays: Holiday[]; // Holidays during this learning path
}

const TimelinePage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [learningPathGroups, setLearningPathGroups] = useState<LearningPathTimelineGroup[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');
  const [showHolidays, setShowHolidays] = useState<boolean>(true);

  // Find the next upcoming assignment
  const nextUpcomingAssignment = useMemo(() => {
    if (!assignments.length) return null;

    const upcomingAssignments = assignments
      .filter(a => a.dueDateObj && a.dueDateObj > currentDate)
      .sort((a, b) => (a.dueDateObj!.getTime() - b.dueDateObj!.getTime()));

    return upcomingAssignments.length > 0 ? upcomingAssignments[0] : null;
  }, [assignments, currentDate]);

  // Check if current date is in a holiday
  const currentHoliday = useMemo(() => {
    return isDateInHoliday(currentDate);
  }, [currentDate]);

  // Helper function to format dates
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Geen deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper function to format dates in compact format
  const formatCompactDate = (dateString?: string | Date): string => {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Helper function to get the color for a learning path
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

  // Load holidays when component mounts
  useEffect(() => {
    // Get all holidays
    const allHolidays = getSchoolHolidays();
    setHolidays(allHolidays);
    
    // Get upcoming holidays
    const upcoming = getUpcomingHolidays(currentDate, 3);
    setUpcomingHolidays(upcoming);
  }, [currentDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assignments and learning paths in parallel
        const [assignmentsData, learningPathsData] = await Promise.all([
          getAssignments(),
          getLearningPaths()
        ]);
        
        // Process assignments to add formatted dates and date objects
        const processedAssignments: Assignment[] = assignmentsData.assignments.map((assignment: Assignment) => {
          let dueDateObj = undefined;
          if (assignment.dueDate) {
            dueDateObj = new Date(assignment.dueDate);
          }
          
          return {
            ...assignment,
            formattedDueDate: formatDate(assignment.dueDate),
            dueDateObj
          };
        });

        setAssignments(processedAssignments);
        
        // Process learning paths to determine earliest and latest deadline
        const processedLearningPaths = learningPathsData.learningPaths.map((lp: LearningPath) => {
          // Initialize with empty array to avoid undefined errors
          lp.assignments = lp.assignments || [];
          return lp;
        });
        
        setLearningPaths(processedLearningPaths);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Group assignments by learning path and create timeline items
  useEffect(() => {
    if (!assignments.length) return;

    // Group assignments by learning path
    const assignmentsByLearningPath: Record<string, Assignment[]> = {};
    
    // Add all assignments with learning paths to their respective groups
    assignments.forEach(assignment => {
      if (assignment.learningPath) {
        const lpId = assignment.learningPath.id;
        if (!assignmentsByLearningPath[lpId]) {
          assignmentsByLearningPath[lpId] = [];
        }
        assignmentsByLearningPath[lpId].push(assignment);
      }
    });
    
    // Create learning path timeline groups
    const groups: LearningPathTimelineGroup[] = [];
    Object.entries(assignmentsByLearningPath).forEach(([lpId, lpAssignments]) => {
      const learningPath = learningPaths.find(lp => lp.id === lpId);
      if (!learningPath) return;
      
      // Sort assignments by due date
      const sortedAssignments = [...lpAssignments].sort((a, b) => {
        if (!a.dueDateObj) return 1;
        if (!b.dueDateObj) return -1;
        return a.dueDateObj.getTime() - b.dueDateObj.getTime();
      });
      
      // Find earliest and latest deadline
      const earliestDeadline = sortedAssignments.reduce((earliest, assignment) => {
        if (!assignment.dueDateObj) return earliest;
        return !earliest || assignment.dueDateObj < earliest ? assignment.dueDateObj : earliest;
      }, null as Date | null);
      
      const latestDeadline = sortedAssignments.reduce((latest, assignment) => {
        if (!assignment.dueDateObj) return latest;
        return !latest || assignment.dueDateObj > latest ? assignment.dueDateObj : latest;
      }, null as Date | null);
      
      if (earliestDeadline && latestDeadline) {
        // Find holidays during this learning path
        const holidaysDuringPath = getHolidaysBetweenDates(earliestDeadline, latestDeadline);
        
        groups.push({
          learningPath: {
            id: lpId,
            title: learningPath.title,
            coverImage: learningPath.coverImage
          },
          startDate: earliestDeadline,
          endDate: latestDeadline,
          assignments: sortedAssignments,
          isPast: latestDeadline < currentDate,
          holidays: holidaysDuringPath
        });
      }
    });
    
    // Sort learning path groups by start date
    groups.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    setLearningPathGroups(groups);
    
    // Create individual timeline items for flat view
    const items: TimelineItem[] = [];
    
    // Add assignments with deadlines to timeline items
    assignments.forEach(assignment => {
      if (!assignment.dueDateObj) return;
      
      const isNextUpcoming = nextUpcomingAssignment?.id === assignment.id;
      
      // Add assignment to timeline
      items.push({
        type: 'assignment',
        id: assignment.id,
        title: assignment.title,
        date: assignment.dueDateObj,
        learningPathId: assignment.learningPath?.id,
        learningPathTitle: assignment.learningPath?.title,
        screenshots: assignment.screenshots,
        orderInPath: assignment.orderInPath,
        isPast: assignment.dueDateObj < currentDate,
        isUpcoming: isNextUpcoming
      });
    });
    
    // Add learning path start and end dates to timeline
    groups.forEach(group => {
      // Add learning path start
      items.push({
        type: 'learningPathStart',
        id: `${group.learningPath.id}-start`,
        title: `Start: ${group.learningPath.title}`,
        date: group.startDate,
        learningPathId: group.learningPath.id,
        learningPathTitle: group.learningPath.title,
        isPast: group.startDate < currentDate,
        isUpcoming: false
      });
      
      // Add learning path end
      items.push({
        type: 'learningPath',
        id: group.learningPath.id,
        title: `Einde: ${group.learningPath.title}`,
        date: group.endDate,
        learningPathId: group.learningPath.id,
        learningPathTitle: group.learningPath.title,
        isPast: group.endDate < currentDate,
        isUpcoming: false
      });
    });
    
    // Sort by date
    items.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    setTimelineItems(items);
  }, [assignments, learningPaths, currentDate, nextUpcomingAssignment]);

  // Filter timeline items based on user selection
  const filteredTimelineItems = timelineItems.filter(item => {
    if (filterType === 'all') return true;
    if (filterType === 'upcoming') return !item.isPast;
    if (filterType === 'past') return item.isPast;
    return true;
  });

  const filteredLearningPathGroups = learningPathGroups.filter(group => {
    if (filterType === 'all') return true;
    if (filterType === 'upcoming') return !group.isPast;
    if (filterType === 'past') return group.isPast;
    return true;
  });

  // Group timeline items by month/year for better organization
  const groupedTimelineItems: Record<string, TimelineItem[]> = {};
  filteredTimelineItems.forEach(item => {
    const monthYear = item.date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    if (!groupedTimelineItems[monthYear]) {
      groupedTimelineItems[monthYear] = [];
    }
    groupedTimelineItems[monthYear].push(item);
  });

  // Sort the groups by date
  const sortedGroups = Object.entries(groupedTimelineItems).sort((a, b) => {
    const dateA = new Date(a[1][0].date);
    const dateB = new Date(b[1][0].date);
    return dateA.getTime() - dateB.getTime();
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-muted animate-pulse h-12 w-64 rounded-lg"></div>
          <div className="bg-muted animate-pulse h-12 w-32 rounded-lg"></div>
        </div>
        <div className="bg-muted animate-pulse h-96 rounded-lg"></div>
      </div>
    );
  }

  const renderAssignmentItem = (item: TimelineItem) => (
    <Link to={`/assignments/${item.id}`} className="block" key={`${item.type}-${item.id}`}>
      <Card className={`mb-3 hover:shadow-md transition-shadow border-l-4 ${item.isUpcoming ? 'border-l-purple-500' : (item.isPast ? 'border-l-gray-300' : 'border-l-blue-500')}`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <div className="flex items-center">
              <BookOpenIcon size={16} className="mr-2" />
              <CardTitle className="text-md font-medium">
                {item.title}
                {item.isUpcoming && (
                  <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-300">
                    Volgende deadline
                  </Badge>
                )}
              </CardTitle>
            </div>
            {item.learningPathTitle && (
              <Badge variant="secondary" className={`mt-1 flex w-fit items-center gap-1 ${getLearningPathColor(item.learningPathTitle)} text-white`}>
                <LayersIcon size={12} />
                {item.learningPathTitle}
              </Badge>
            )}
          </div>
          <Badge variant={item.isPast ? "outline" : "default"} className="flex items-center gap-1">
            <CalendarIcon size={12} />
            {item.date.toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Badge>
        </CardHeader>
        <CardContent className="pt-2">
          {item.screenshots && item.screenshots.length > 0 && (
            <div className="h-32 w-full overflow-hidden rounded-md">
              <img 
                src={getFullUrl(item.screenshots[0].image.url)} 
                alt={item.screenshots[0].caption || `${item.title} thumbnail`}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );

  const renderLearningPathItem = (item: TimelineItem) => (
    <Link to={`/learning-paths/${item.learningPathId}`} className="block" key={`${item.type}-${item.id}`}>
      <Card className={`mb-3 hover:shadow-md transition-shadow border-l-4 ${item.isPast ? 'border-l-gray-300' : `border-l-blue-500`}`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <LayersIcon size={16} className="mr-2" />
            <CardTitle className="text-md font-medium">
              {item.title}
            </CardTitle>
          </div>
          <Badge variant={item.isPast ? "outline" : "default"} className="flex items-center gap-1">
            <CalendarIcon size={12} />
            {item.date.toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground">
            {item.type === 'learningPathStart' ? 'Start leerpad' : 'Einddatum leerpad (laatste deadline)'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );

  const renderHolidayBanner = (holiday: Holiday) => {
    return (
      <div 
        className="px-4 py-2 rounded-md mb-4 flex items-center justify-between"
        style={{ backgroundColor: holiday.color }}
      >
        <div className="flex items-center">
          <UmbrellaIcon className="mr-2" size={16} />
          <span className="font-medium">{holiday.name}</span>
        </div>
        <span className="text-sm">
          {formatHolidayDate(holiday.startDate)} - {formatHolidayDate(holiday.endDate)}
        </span>
      </div>
    );
  };

  

  const renderImprovedTimelineView = () => (
    <div className="relative">
     



      {filteredLearningPathGroups.length > 0 ? (
        <div className="space-y-12">
          {filteredLearningPathGroups.map(group => (
            <div key={group.learningPath.id} className="border rounded-lg p-6">
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`w-2 h-16 ${getLearningPathColor(group.learningPath.title)} rounded-full mr-4`}></div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{group.learningPath.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <CalendarIcon size={14} className="mr-1" />
                          {formatCompactDate(group.startDate)}
                        </span>
                        <ArrowRightIcon size={14} className="mx-2" />
                        <span className="flex items-center">
                          <CalendarIcon size={14} className="mr-1" />
                          {formatCompactDate(group.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/learning-paths/${group.learningPath.id}`}>
                    <Button variant="outline" size="sm">
                      Bekijk leerpad
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Calculate the duration in weeks */}
              {(() => {
                const durationMs = group.endDate.getTime() - group.startDate.getTime();
                const durationWeeks = Math.ceil(durationMs / (1000 * 60 * 60 * 24 * 7));
                return (
                  <div className="mb-4 ml-4 pl-8">
                    <Badge variant="outline" className="bg-gray-100">
                      <span className="font-medium">Duur: {durationWeeks} {durationWeeks === 1 ? 'week' : 'weken'}</span>
                    </Badge>
                  </div>
                );
              })()}
              
              <div className="relative border-l-2 border-dotted border-gray-300 pl-8 ml-4 space-y-4">
                {(() => {
                  // Create a combined timeline of assignments and holidays
                  const timelineItems: Array<{
                    type: 'assignment' | 'holiday';
                    date: Date;
                    item: Assignment | Holiday;
                  }> = [];
                  
                  // Add assignments to the timeline
                  group.assignments.forEach(assignment => {
                    if (assignment.dueDateObj) {
                      timelineItems.push({
                        type: 'assignment',
                        date: assignment.dueDateObj,
                        item: assignment
                      });
                    }
                  });
                  
                  // Add holidays to the timeline
                  if (showHolidays) {
                    group.holidays.forEach(holiday => {
                      timelineItems.push({
                        type: 'holiday',
                        date: holiday.startDate,
                        item: holiday
                      });
                    });
                  }
                  
                  // Sort the combined timeline by date
                  timelineItems.sort((a, b) => a.date.getTime() - b.date.getTime());
                  
                  // Render the combined timeline
                  return timelineItems.map((timelineItem, index) => {
                    if (timelineItem.type === 'assignment') {
                      const assignment = timelineItem.item as Assignment;
                      const isUpcoming = nextUpcomingAssignment?.id === assignment.id;
                      const isPast = assignment.dueDateObj ? assignment.dueDateObj < currentDate : false;
                      
                      // Check if assignment deadline falls during a holiday
                      const holidayDuringDeadline = assignment.dueDateObj ? 
                        isDateInHoliday(assignment.dueDateObj) : null;
                      
                      return (
                        <div key={`assignment-${assignment.id}`} className="relative">
                          {/* Timeline dot */}
                          <div className={`absolute -left-10 top-1/2 transform -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white ${isUpcoming ? 'bg-purple-500' : (isPast ? 'bg-gray-300' : 'bg-blue-500')}`}></div>
                          
                          <Link to={`/assignments/${assignment.id}`}>
                            <Card className={`hover:shadow-md transition-shadow ${isUpcoming ? 'border-purple-200 bg-purple-50' : ''}`}>
                              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div>
                                  <div className="flex items-center">
                                    <BookOpenIcon size={16} className="mr-2" />
                                    <CardTitle className="text-md font-medium">
                                      {assignment.title}
                                      {isUpcoming && (
                                        <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-300">
                                          Volgende deadline
                                        </Badge>
                                      )}
                                    </CardTitle>
                                  </div>
                                  {assignment.orderInPath && (
                                    <span className="text-sm text-muted-foreground">
                                      Onderdeel {assignment.orderInPath}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  {holidayDuringDeadline && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div 
                                            className="h-5 w-5 rounded-full mr-2 flex items-center justify-center cursor-help" 
                                            style={{ backgroundColor: holidayDuringDeadline.color }}
                                          >
                                            <UmbrellaIcon size={12} />
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Deadline valt tijdens {holidayDuringDeadline.name}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  <Badge variant={isPast ? "outline" : "default"} className={`flex items-center gap-1 ${isUpcoming ? 'bg-purple-500' : ''}`}>
                                    <CalendarIcon size={12} />
                                    {assignment.dueDateObj?.toLocaleDateString('nl-NL', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-2">
                                {assignment.screenshots && assignment.screenshots.length > 0 && (
                                  <div className="h-32 w-full overflow-hidden rounded-md">
                                    <img 
                                      src={getFullUrl(assignment.screenshots[0].image.url)} 
                                      alt={assignment.screenshots[0].caption || `${assignment.title} thumbnail`}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        </div>
                      );
                    } else {
                      // Render holiday item
                      const holiday = timelineItem.item as Holiday;
                      return (
                        <div key={`holiday-${holiday.name}`} className="relative">
                          {/* Holiday timeline marker */}
                          <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: holiday.color }}>
                            <UmbrellaIcon size={12} className="text-white" />
                          </div>
                          
                          <div 
                            className="p-3 rounded-md"
                            style={{ backgroundColor: holiday.color }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <UmbrellaIcon size={16} className="mr-2" />
                                <span className="font-medium">{holiday.name}</span>
                              </div>
                              <span className="text-sm">
                                {formatHolidayDate(holiday.startDate)} - {formatHolidayDate(holiday.endDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  });
                })()}
                
                {/* Final deadline marker */}
                <div className="relative">
                  <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full border-2 border-white bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  
                  <Card className="bg-red-50">
                    <CardHeader className="flex flex-row items-center justify-between p-2">
                      <CardTitle className="text-red-800 text-md font-medium flex items-center">
                        <ArrowRightIcon size={16} className="mr-2 text-red-600" />
                        Deadline voor inleveren via Teams
                      </CardTitle>
                      <Badge 
                        variant={group.isPast ? "outline" : "default"} 
                        className={`flex items-center gap-1 ${group.isPast ? 'border-red-300' : 'bg-red-500'}`}
                      >
                        <CalendarIcon size={12} className="text-current" />
                        {group.endDate.toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'short', 
                          year: 'numeric'
                        })}
                      </Badge>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center border rounded-lg">
          <p className="text-muted-foreground">Geen leerpaden gevonden voor de geselecteerde filter.</p>
        </div>
      )}

      {/* Independent assignments (not part of learning paths) */}
      {filteredTimelineItems.some(item => 
        item.type === 'assignment' && !item.learningPathId
      ) && (
        <div className="mt-12 border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Losse opdrachten</h3>
          <div className="space-y-4">
            {filteredTimelineItems
              .filter(item => item.type === 'assignment' && !item.learningPathId)
              .map(item => renderAssignmentItem(item))}
          </div>
        </div>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {/* Show upcoming holidays at the top in list view too */}
      {showHolidays && upcomingHolidays.length > 0 && (
        <div className="mb-8 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <CalendarDaysIcon className="mr-2" size={18} />
            Aankomende schoolvakanties
          </h3>
          <div className="space-y-2">
            {upcomingHolidays.map(holiday => (
              <div 
                key={holiday.name} 
                className="flex justify-between items-center px-3 py-2 rounded-md"
                style={{ backgroundColor: holiday.color }}
              >
                <span>{holiday.name}</span>
                <span className="text-sm">
                  {formatHolidayDate(holiday.startDate)} - {formatHolidayDate(holiday.endDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sortedGroups.length > 0 ? (
        sortedGroups.map(([monthYear, items]) => {
          // Find if there are any holidays that start in this month/year
          const monthDate = new Date(items[0].date);
          const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
          const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
          const holidaysInMonth = holidays.filter(
            h => (h.startDate >= monthStart && h.startDate <= monthEnd) ||
                 (h.endDate >= monthStart && h.endDate <= monthEnd)
          );

          return (
            <div key={monthYear}>
              <h3 className="mb-4 text-lg font-semibold">{monthYear}</h3>
              
              {/* Show holidays for this month */}
              {showHolidays && holidaysInMonth.length > 0 && (
                <div className="mb-4 space-y-2">
                  {holidaysInMonth.map(holiday => renderHolidayBanner(holiday))}
                </div>
              )}
              
              <div className="space-y-3">
                {items.map(item => (
                  item.type === 'assignment' 
                    ? renderAssignmentItem(item) 
                    : renderLearningPathItem(item)
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-10 text-center border rounded-lg">
          <p className="text-muted-foreground">Geen deadlines gevonden voor de geselecteerde filter.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tijdlijn Deadlines</h1>
        
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="w-fit" onValueChange={(value) => setFilterType(value as 'all' | 'upcoming' | 'past')}>
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <FilterIcon size={14} />
                Alle
              </TabsTrigger>
              <TabsTrigger value="upcoming">Aankomend</TabsTrigger>
              <TabsTrigger value="past">Verlopen</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === 'timeline' ? 'list' : 'timeline')}
          >
            {viewMode === 'timeline' ? 'Lijstweergave' : 'Tijdlijnweergave'}
          </Button>
        </div>
      </div>

      {viewMode === 'timeline' ? renderImprovedTimelineView() : renderListView()}

      <div className="mt-8 flex justify-end">
        <Button asChild variant="default">
          <Link to="/assignments" className="flex items-center gap-2">
            <BookOpenIcon size={16} />
            Alle opdrachten bekijken
            <ChevronRightIcon size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export { TimelinePage };