// src/pages/AssignmentDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { getAssignmentById, getFullUrl } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ArrowLeftIcon,
  FileIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const AssignmentDetailPage = () => {
  interface Assignment {
    id: string;
    title: string;
    description?: {
      document: any;
    };
    dueDate?: string;
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
  
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await getAssignmentById(id!);
        setAssignment(data.assignment);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setError('Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssignment();
    } else {
      setError('Assignment ID is missing');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 bg-muted animate-pulse rounded mb-6"></div>
        <div className="h-24 bg-muted animate-pulse rounded"></div>
        <div className="h-64 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">{error || 'Assignment not found'}</p>
        <Button asChild className="mt-4">
          <Link to="/assignments">Back to Assignments</Link>
        </Button>
      </div>
    );
  }

  // Format due date
  const formattedDueDate = assignment.dueDate 
    ? new Date(assignment.dueDate).toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        size="sm" 
        asChild 
        className="mb-8"
      >
        <Link to="/assignments" className="flex items-center">
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Assignments
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
        
        {formattedDueDate && (
          <Badge variant="secondary" className="flex items-center">
            <CalendarIcon size={14} className="mr-2" />
            Due: {formattedDueDate}
          </Badge>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileIcon size={18} className="mr-2" />
            Assignment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          {assignment.description && assignment.description.document ? (
            <DocumentRenderer document={assignment.description.document} />
          ) : (
            <p className="text-muted-foreground">No detailed description available for this assignment.</p>
          )}
        </CardContent>
      </Card>
      
      {assignment.projects && assignment.projects.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold tracking-tight">Student Projects</h2>
          <p className="text-muted-foreground">
            Projects submitted for this assignment:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignment.projects.map((project) => {
              // Get thumbnail from first screenshot if available
              const thumbnailUrl = project.screenshots && 
                project.screenshots.length > 0 && 
                project.screenshots[0].image ? 
                getFullUrl(project.screenshots[0].image.url) : 
                undefined;
              
              // Get first paragraph or first 100 characters of description
              const getDescriptionExcerpt = () => {
                if (!project.description || !project.description.document) {
                  return null;
                }

                // Try to extract text from the document
                let excerpt = '';
                try {
                  // Look for the first paragraph
                  for (const block of project.description.document) {
                    if (block.children) {
                      for (const child of block.children) {
                        if (child.text) {
                          excerpt += child.text + ' ';
                        }
                      }
                      if (excerpt) break; // Stop after first paragraph
                    }
                  }
                } catch (error) {
                  console.error('Error extracting text from description', error);
                  return null;
                }

                // Truncate to ~100 characters if needed
                if (excerpt.length > 100) {
                  return excerpt.substring(0, 100).trim() + '...';
                }
                return excerpt || null;
              };

              const descriptionExcerpt = getDescriptionExcerpt();

              return (
                <Card key={project.id} className="hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {thumbnailUrl ? (
                      <img 
                        src={thumbnailUrl} 
                        alt={`${project.title} screenshot`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Error loading image:`, e);
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-muted-foreground">No preview available</span></div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No preview available</span>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 flex-grow">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <span>By: {project.student.name}</span>
                      {project.student.class && (
                        <span className="ml-1">({project.student.class})</span>
                      )}
                    </div>
                    
                    {descriptionExcerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {descriptionExcerpt}
                      </p>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/projects/${project.id}`}>
                        View Project
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export { AssignmentDetailPage };