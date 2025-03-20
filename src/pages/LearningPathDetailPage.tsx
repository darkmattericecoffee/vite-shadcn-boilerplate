// src/pages/LearningPathDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLearningPathById, getFullUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, BookOpenIcon, LayersIcon, GraduationCapIcon, ChevronRightIcon } from 'lucide-react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { LearningPath, LearningPathAssignment } from '@/types/learning-path';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

const LearningPathDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        const data = await getLearningPathById(id!);
        setLearningPath(data.learningPath);
      } catch (error) {
        console.error('Error fetching learning path:', error);
        setError('Failed to load learning path details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLearningPath();
    } else {
      setError('Learning Path ID is missing');
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

  if (error || !learningPath) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">{error || 'Learning Path not found'}</p>
        <Button asChild className="mt-4">
          <Link to="/learning-paths">Back to Learning Paths</Link>
        </Button>
      </div>
    );
  }

  // Sort assignments by orderInPath if available
  const sortedAssignments = learningPath.assignments 
    ? [...learningPath.assignments].sort((a: LearningPathAssignment, b: LearningPathAssignment) => {
        if (a.orderInPath !== undefined && b.orderInPath !== undefined) {
          return a.orderInPath - b.orderInPath;
        }
        return 0;
      })
    : [];

  // Filter projects to show only final deliverables - should now be pre-filtered by the API
  const finalProjects = learningPath.projects || [];

  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          className="mb-4"
        >
          <Link to="/learning-paths" className="flex items-center">
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Learning Paths
          </Link>
        </Button>
        
        {/* Hero section */}
        <div className="flex flex-col space-y-4">
          {learningPath.coverImage && (
            <div className="w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden relative">
              <img 
                src={getFullUrl(learningPath.coverImage.url)} 
                alt={`${learningPath.title} cover`}
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              
              {/* Title on image */}
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                  {learningPath.title}
                </h1>
                
                {learningPath.createdBy && (
                  <p className="text-white/80 mt-2">
                    Created by {learningPath.createdBy.name}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* If no cover image, show title normally */}
          {!learningPath.coverImage && (
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {learningPath.title}
              </h1>
              {learningPath.createdBy && (
                <p className="text-muted-foreground mt-2">
                  Created by {learningPath.createdBy.name}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Description */}
      {learningPath.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LayersIcon size={18} className="mr-2" />
              About this Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <DocumentRenderer document={learningPath.description.document} />
          </CardContent>
        </Card>
      )}
      
      {/* Assignments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <BookOpenIcon size={20} className="mr-2" />
            Assignments
          </h2>
          <Badge variant="secondary" className="px-3 py-1">
            {sortedAssignments.length} Assignment{sortedAssignments.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        {sortedAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAssignments.map((assignment, index) => {
              // Get first screenshot if available
              const thumbnailImage = assignment.screenshots && 
                assignment.screenshots.length > 0 && 
                assignment.screenshots[0].image ? 
                getFullUrl(assignment.screenshots[0].image.url) : 
                null;
                
              return (
                <Link 
                  to={`/assignments/${assignment.id}`} 
                  key={assignment.id}
                  className="block group"
                >
                  <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
                    {thumbnailImage ? (
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={thumbnailImage} 
                          alt={`${assignment.title} thumbnail`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-muted flex items-center justify-center">
                        <BookOpenIcon size={40} className="text-muted-foreground opacity-30" />
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="mb-2">Step {index + 1}</Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {assignment.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      {assignment.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {/* Simple text extraction - could be improved */}
                          {assignment.description.document[0]?.children?.[0]?.text || "No description available"}
                        </p>
                      )}
                    </CardContent>
                    
                    <CardFooter>
                      <Button variant="outline" className="w-full pointer-events-none">
                        <div className="flex items-center justify-center">
                          <ChevronRightIcon size={16} className="mr-2" />
                          View Assignment
                        </div>
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">No assignments available for this learning path.</p>
          </div>
        )}
      </div>
      
      {/* Final Projects Section */}
      <div className="space-y-4 mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <GraduationCapIcon size={20} className="mr-2" />
            Final Deliverables
          </h2>
          <Badge variant="secondary" className="px-3 py-1">
            {finalProjects.length} Project{finalProjects.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        {finalProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {finalProjects.map((project) => {
              // Get thumbnail from first screenshot if available
              const thumbnailUrl = project.screenshots && 
                project.screenshots.length > 0 && 
                project.screenshots[0].image ? 
                getFullUrl(project.screenshots[0].image.url) : 
                undefined;
              
              return (
                <Link 
                  to={`/projects/${project.id}`} 
                  key={project.id}
                  className="block group"
                >
                  <Card className="hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {thumbnailUrl ? (
                        <img 
                          src={thumbnailUrl} 
                          alt={`${project.title} screenshot`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">No preview available</span>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <GraduationCapIcon size={14} className="mr-1" />
                        <span>{project.student.name}</span>
                        {project.student.class && (
                          <span className="ml-1">({project.student.class})</span>
                        )}
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                          {/* Simple text extraction */}
                          {project.description.document[0]?.children?.[0]?.text || ""}
                        </p>
                      )}
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full pointer-events-none">
                        <div className="flex items-center justify-center">
                          <ChevronRightIcon size={16} className="mr-2" />
                          View Final Project
                        </div>
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">No final deliverables available for this learning path yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { LearningPathDetailPage };