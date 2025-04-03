// src/pages/AssignmentsPage.tsx with deadline sorting functionality
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAssignments, getLearningPaths, getFullUrl } from '@/lib/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ChevronRightIcon, 
  FileTextIcon, 
  LayersIcon,
  SortAscIcon,
  SortDescIcon,
  CalendarClockIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LearningPathButtons } from '@/components/assignment/assignment-learning-path-bubbles';
import { LearningPathSidebar } from '@/components/assignment/assignment-learning-path-sidebar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown";




const AssignmentsPage = () => {
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
  }

  interface Assignment {
    id: string;
    title: string;
    description?: {
      document: any;
    };
    dueDate?: string;
    dueDateObj?: Date; // Added for sorting
    screenshots?: Screenshot[];
    learningPath?: LearningPath;
  }

  interface AssignmentsByLearningPath {
    learningPath: LearningPath | null;
    assignments: Assignment[];
  }

  interface LearningPathOption {
    id: string;
    title: string;
  }

  type SortOrder = 'default' | 'deadlineAsc' | 'deadlineDesc';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPathOption[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [groupedAssignments, setGroupedAssignments] = useState<AssignmentsByLearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLearningPathId, setSelectedLearningPathId] = useState<string | null>(
    searchParams.get('learningPath') || null
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get('sort') as SortOrder) || 'default'
  );
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(
    window.innerWidth > 768 ? 'desktop' : 'mobile'
  );

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth > 768 ? 'desktop' : 'mobile');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assignments and learning paths in parallel
        const [assignmentsData, learningPathsData] = await Promise.all([
          getAssignments(),
          getLearningPaths()
        ]);
        
        // Process assignments to add date objects for sorting
        const processedAssignments = assignmentsData.assignments.map((assignment: Assignment) => {
          return {
            ...assignment,
            dueDateObj: assignment.dueDate ? new Date(assignment.dueDate) : undefined
          };
        });
        
        setAssignments(processedAssignments);
        setLearningPaths(learningPathsData.learningPaths);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters, sorting, and group assignments by learning path
  useEffect(() => {
    // First filter assignments by selected learning path
    let filtered = [...assignments];
    
    if (selectedLearningPathId) {
      filtered = filtered.filter(
        assignment => assignment.learningPath && assignment.learningPath.id === selectedLearningPathId
      );
    }
    
    // Apply sorting if needed
    if (sortOrder === 'deadlineAsc') {
      filtered.sort((a, b) => {
        // Assignments without deadlines go to the end
        if (!a.dueDateObj) return 1;
        if (!b.dueDateObj) return -1;
        return a.dueDateObj.getTime() - b.dueDateObj.getTime();
      });
    } else if (sortOrder === 'deadlineDesc') {
      filtered.sort((a, b) => {
        // Assignments without deadlines go to the end
        if (!a.dueDateObj) return 1;
        if (!b.dueDateObj) return -1;
        return b.dueDateObj.getTime() - a.dueDateObj.getTime();
      });
    }
    
    setFilteredAssignments(filtered);
    
    // Then group them by learning path
    const grouped: { [key: string]: AssignmentsByLearningPath } = {};
    
    // First add assignments with learning paths
    filtered.forEach(assignment => {
      if (assignment.learningPath) {
        const lpId = assignment.learningPath.id;
        if (!grouped[lpId]) {
          grouped[lpId] = {
            learningPath: assignment.learningPath,
            assignments: []
          };
        }
        grouped[lpId].assignments.push(assignment);
      }
    });
    
    // Then add assignments without learning paths
    const withoutLearningPath = filtered.filter(assignment => !assignment.learningPath);
    if (withoutLearningPath.length > 0) {
      grouped['none'] = {
        learningPath: null,
        assignments: withoutLearningPath
      };
    }
    
    // Convert to array and sort
    const groupedArray = Object.values(grouped).sort((a, b) => {
      // Put "none" group at the end
      if (!a.learningPath) return 1;
      if (!b.learningPath) return -1;
      // Sort by learning path title
      return a.learningPath.title.localeCompare(b.learningPath.title);
    });
    
    setGroupedAssignments(groupedArray);
  }, [assignments, selectedLearningPathId, sortOrder]);

  // Update URL when filter or sort changes
  useEffect(() => {
    if (!selectedLearningPathId) {
      searchParams.delete('learningPath');
    } else {
      searchParams.set('learningPath', selectedLearningPathId);
    }
    
    if (sortOrder === 'default') {
      searchParams.delete('sort');
    } else {
      searchParams.set('sort', sortOrder);
    }
    
    setSearchParams(searchParams);
  }, [selectedLearningPathId, sortOrder, searchParams, setSearchParams]);

  const handleLearningPathSelect = (learningPathId: string | null) => {
    setSelectedLearningPathId(learningPathId);
  };

  const handleSortChange = (newSortOrder: SortOrder) => {
    setSortOrder(newSortOrder);
  };

  // Helper function to extract plain text from the document structure
  const getPlainTextDescription = (document: any) => {
    if (!document) return '';
    
    try {
      // Parse the document if it's a string
      const parsedDoc = typeof document === 'string' 
        ? JSON.parse(document) 
        : document;
      
      // Extract text content from paragraphs
      if (parsedDoc && parsedDoc.content) {
        return parsedDoc.content
          .filter((node: any) => node.type === 'paragraph')
          .map((para: any) => {
            if (para.content) {
              return para.content
                .filter((textNode: any) => textNode.type === 'text')
                .map((textNode: any) => textNode.text)
                .join('');
            }
            return '';
          })
          .join(' ')
          .substring(0, 150) + (parsedDoc.content.length > 1 ? '...' : '');
      }
    } catch (error) {
      console.error('Error parsing document:', error);
    }
    
    return '';
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

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Geen deadline';
    
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper to determine if an assignment is past due
  const isPastDue = (dueDate?: string): boolean => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Render assignment card
  const renderAssignmentCard = (assignment: Assignment) => {
    const pastDue = isPastDue(assignment.dueDate);
    
    return (
      <Link 
        to={`/assignments/${assignment.id}`} 
        key={assignment.id} 
        className="block group"
      >
        <Card className={`hover:shadow-md transition-shadow overflow-hidden h-full ${pastDue ? 'border-l-4 border-l-amber-500' : ''}`}>
          {assignment.screenshots && assignment.screenshots.length > 0 && (
            <div className="relative h-48 overflow-hidden">
              <img 
                src={getFullUrl(assignment.screenshots[0].image.url)} 
                alt={assignment.screenshots[0].caption || `${assignment.title} thumbnail`}
                className="object-cover w-full h-full"
              />
              
              {/* Learning Path Badge - Appear on top of the image */}
              {assignment.learningPath && (
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="secondary" 
                    className={`flex items-center gap-1.5 ${getLearningPathColor(assignment.learningPath.title)} text-white`}
                  >
                    <LayersIcon size={12} />
                    {assignment.learningPath.title}
                  </Badge>
                </div>
              )}
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                <BookOpenIcon size={20} className="mr-2 flex-shrink-0" />
                <span>{assignment.title}</span>
              </CardTitle>
              
              {/* If we don't have a screenshot but do have a learning path, show the badge here */}
              {(!assignment.screenshots || assignment.screenshots.length === 0) && 
              assignment.learningPath && (
                <Badge 
                  variant="secondary" 
                  className={`flex items-center gap-1.5 ml-2 flex-shrink-0 ${getLearningPathColor(assignment.learningPath.title)} text-white`}
                >
                  <LayersIcon size={12} />
                  {assignment.learningPath.title}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {assignment.dueDate && (
              <div className={`flex items-center ${pastDue ? 'text-amber-600 font-medium' : 'text-muted-foreground'} mb-3`}>
                <CalendarIcon size={16} className="mr-2" />
                <span>Deadline: {formatDate(assignment.dueDate)}</span>
                {pastDue && <Badge variant="outline" className="ml-2 text-amber-600 border-amber-600">Verlopen</Badge>}
              </div>
            )}
            
            {assignment.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {getPlainTextDescription(assignment.description.document)}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button variant="default" className="flex-1 pointer-events-none">
              <div className="flex items-center justify-center">
                <FileTextIcon size={16} className="mr-2" />
                Details
              </div>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
                <Link 
                to={`/projects?assignment=${assignment.id}`} 
                className="flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                >
                <ChevronRightIcon size={16} />
                Inzendingen
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="bg-muted animate-pulse h-64 rounded-lg"></div>
        </div>
        <div className="flex-1">
          <div className="bg-muted animate-pulse h-16 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-muted animate-pulse h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
      {/* Sidebar for desktop view */}
      {viewMode === 'desktop' && (
        <LearningPathSidebar 
          learningPaths={learningPaths}
          selectedLearningPathId={selectedLearningPathId}
          onLearningPathSelect={handleLearningPathSelect}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Opdrachten</h1>
          
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {sortOrder === 'default' && <SortAscIcon size={16} />}
                  {sortOrder === 'deadlineAsc' && <CalendarClockIcon size={16} />}
                  {sortOrder === 'deadlineDesc' && <CalendarClockIcon size={16} className="rotate-180" />}
                  
                  {sortOrder === 'default' && "Standaard"}
                  {sortOrder === 'deadlineAsc' && "Deadline (oplopend)"}
                  {sortOrder === 'deadlineDesc' && "Deadline (aflopend)"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSortChange('default')}>
                  <SortAscIcon size={16} className="mr-2" />
                  Standaard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('deadlineAsc')}>
                  <CalendarClockIcon size={16} className="mr-2" />
                  Deadline (oplopend)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('deadlineDesc')}>
                  <CalendarClockIcon size={16} className="mr-2 rotate-180" />
                  Deadline (aflopend)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Timeline View Link */}
            <Button asChild variant="outline">
              <Link to="/timeline" className="gap-2">
                <CalendarIcon size={16} />
                Tijdlijn weergave
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter buttons for all views */}
        <LearningPathButtons 
          learningPaths={learningPaths}
          selectedLearningPathId={selectedLearningPathId}
          onLearningPathSelect={handleLearningPathSelect}
        />

        {filteredAssignments.length > 0 ? (
          <div className="space-y-16">
            {groupedAssignments.map((group) => (
              <div key={group.learningPath?.id || 'none'} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <LayersIcon size={20} />
                    <h2 className="text-2xl font-semibold">
                      {group.learningPath ? group.learningPath.title : "Overige Opdrachten"}
                    </h2>
                    <Badge variant="outline">{group.assignments.length}</Badge>
                  </div>
                  
                  {/* Colored underline that matches the learning path color */}
                  {group.learningPath && (
                    <div className={`h-1 w-24 mt-2 rounded-full ${getLearningPathColor(group.learningPath.title)}`}></div>
                  )}
                  {!group.learningPath && (
                    <div className="h-1 w-24 mt-2 rounded-full bg-gray-500"></div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.assignments.map(renderAssignmentCard)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Geen opdrachten gevonden die overeenkomen met de geselecteerde filters.</p>
            {selectedLearningPathId && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => handleLearningPathSelect(null)}
              >
                Toon alle opdrachten
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { AssignmentsPage };