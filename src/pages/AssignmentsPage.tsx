// src/pages/AssignmentsPage.tsx with sidebar filters
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
import { BookOpenIcon, CalendarIcon, ChevronRightIcon, FileTextIcon, FilterIcon, LayersIcon, XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    screenshots?: Screenshot[];
    learningPath?: LearningPath;
  }

  interface LearningPathOption {
    id: string;
    title: string;
  }

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPathOption[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLearningPath, setSelectedLearningPath] = useState<string>(
    searchParams.get('learningPath') || 'all'
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assignments and learning paths in parallel
        const [assignmentsData, learningPathsData] = await Promise.all([
          getAssignments(),
          getLearningPaths()
        ]);
        
        setAssignments(assignmentsData.assignments);
        setLearningPaths(learningPathsData.learningPaths);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters whenever assignments or selected learning path changes
  useEffect(() => {
    if (selectedLearningPath === 'all') {
      setFilteredAssignments(assignments);
    } else {
      setFilteredAssignments(
        assignments.filter(
          assignment => assignment.learningPath && assignment.learningPath.id === selectedLearningPath
        )
      );
    }
  }, [assignments, selectedLearningPath]);

  // Update URL when filter changes
  useEffect(() => {
    if (selectedLearningPath === 'all') {
      searchParams.delete('learningPath');
    } else {
      searchParams.set('learningPath', selectedLearningPath);
    }
    setSearchParams(searchParams);
  }, [selectedLearningPath, searchParams, setSearchParams]);

  const handleLearningPathChange = (value: string) => {
    setSelectedLearningPath(value);
  };

  const clearFilters = () => {
    setSelectedLearningPath('all');
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

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-6">
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
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
        <div className="bg-card border rounded-lg p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center">
              <FilterIcon size={18} className="mr-2" />
              Filter Opdrachten
            </h2>
            
            {selectedLearningPath !== 'all' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <XIcon size={14} className="mr-1" />
                Wis filters
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Leerpad</label>
              <Select value={selectedLearningPath} onValueChange={handleLearningPathChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All learning paths" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle leerpaden</SelectItem>
                  {learningPaths.map((path) => (
                    <SelectItem key={path.id} value={path.id}>
                      {path.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* You can add more filters here later if needed */}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Opdrachten</h1>

        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAssignments.map((assignment) => (
              <Link 
                to={`/assignments/${assignment.id}`} 
                key={assignment.id} 
                className="block group"
              >
                <Card className="hover:shadow-md transition-shadow overflow-hidden h-full">
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
                          <Badge variant="secondary" className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm">
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
                        <Badge variant="secondary" className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                          <LayersIcon size={12} />
                          Leerpad
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assignment.dueDate && (
                      <div className="flex items-center text-muted-foreground mb-3">
                        <CalendarIcon size={16} className="mr-2" />
                        <span>Deadline: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {/* Learning Path info - display when there's no screenshot */}
                    {(!assignment.screenshots || assignment.screenshots.length === 0) && 
                    assignment.learningPath && (
                      <div className="flex items-center text-muted-foreground mb-3">
                        <LayersIcon size={16} className="mr-2" />
                        <span>Leerpad: {assignment.learningPath.title}</span>
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
                        Toon Details
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
                        <ChevronRightIcon size={16} className="mr-2" />
                        Toon inzendingen
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">Geen opdrachten gevonden die overeenkomen met de geselecteerde filters.</p>
            {selectedLearningPath !== 'all' && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={clearFilters}
              >
                Wis Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { AssignmentsPage };