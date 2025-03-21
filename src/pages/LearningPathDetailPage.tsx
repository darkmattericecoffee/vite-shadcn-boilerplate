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
    <div className="space-y-12">
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
            <div className="w-full h-56 md:h-64 lg:h-96 rounded-lg overflow-hidden relative">
              <img 
                src={getFullUrl(learningPath.coverImage.url)} 
                alt={`${learningPath.title} cover`}
                className="w-full h-full object-cover"
              />
              {/* Improved overlay gradient - darker at bottom for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
              
              {/* Title on image - positioned better with more padding and shadow */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  {learningPath.title}
                </h1>
                
                {learningPath.createdBy && (
                  <p className="text-white/90 mt-3 flex items-center">
                    Created by <span className="font-medium ml-1">{learningPath.createdBy.name}</span>
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
      
      {/* Main Content with improved spacing and layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left column for Description and Assignments */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description with improved spacing */}
          {learningPath.description && (
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <LayersIcon size={18} className="mr-2" />
                  About this Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none p-6">
                <DocumentRenderer document={learningPath.description.document} />
              </CardContent>
            </Card>
          )}
          
          {/* Assignments Section with improved spacing */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-2xl font-bold flex items-center">
                <BookOpenIcon size={20} className="mr-2" />
                Assignments
              </h2>
              <Badge variant="secondary" className="px-3 py-1">
                {sortedAssignments.length} Assignment{sortedAssignments.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {sortedAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Card className="hover:shadow-lg transition-all border-muted/70 hover:border-primary/30 h-full flex flex-col">
                        {thumbnailImage ? (
                          <div className="h-40 overflow-hidden relative">
                            <img 
                              src={thumbnailImage} 
                              alt={`${assignment.title} thumbnail`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 group-hover:opacity-0 transition-opacity"></div>
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
                        
                        <CardContent className="flex-grow py-2">
                          {assignment.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {/* Simple text extraction - could be improved */}
                              {assignment.description.document[0]?.children?.[0]?.text || "No description available"}
                            </p>
                          )}
                        </CardContent>
                        
                        <CardFooter className="pt-4">
                          <Button variant="outline" className="w-full group-hover:bg-primary/5 transition-colors pointer-events-none">
                            <div className="flex items-center justify-center">
                              <span className="mr-1">View Assignment</span>
                              <ChevronRightIcon size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
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
        </div>
        
        {/* Right column for Final Deliverables preview */}
        <div className="mt-10 lg:mt-0">
          <div className="sticky top-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-xl font-bold flex items-center">
                <GraduationCapIcon size={18} className="mr-2" />
                Final Deliverables
              </h2>
              <Badge variant="secondary" className="px-3 py-1">
                {finalProjects.length} Project{finalProjects.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {finalProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {/* Only show up to 3 projects in the sidebar */}
                  {finalProjects.slice(0, 3).map((project) => {
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
                        <Card className="hover:shadow-md transition-all border-muted/70 hover:border-primary/30 overflow-hidden flex flex-col h-full">
                          <div className="flex">
                            <div className="w-1/3 bg-muted relative overflow-hidden">
                              {thumbnailUrl ? (
                                <img 
                                  src={thumbnailUrl} 
                                  alt={`${project.title} screenshot`}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center p-2">
                                  <GraduationCapIcon size={24} className="text-muted-foreground opacity-50" />
                                </div>
                              )}
                            </div>
                            
                            <div className="w-2/3 p-3">
                              <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                                {project.title}
                              </h3>
                              
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <span className="line-clamp-1">{project.student.name}</span>
                                {project.student.class && (
                                  <span className="ml-1 text-xs opacity-70">({project.student.class})</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
                
                {/* "Show All" button - scrolls to the projects section below */}
                {finalProjects.length > 3 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => document.getElementById('all-projects')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <div className="flex items-center justify-center">
                      <span>Show All {finalProjects.length} Projects</span>
                      <ChevronRightIcon size={14} className="ml-2" />
                    </div>
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-6 border rounded-lg">
                <p className="text-muted-foreground text-sm">No final deliverables available for this learning path yet.</p>
              </div>
            )}
            
            {/* Quick Info Card */}
            <Card className="bg-primary/5 border-primary/20 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <BookOpenIcon size={14} className="mr-2 mt-1 text-primary" />
                    <span>{sortedAssignments.length} step-by-step assignments</span>
                  </li>
                  <li className="flex items-start">
                    <GraduationCapIcon size={14} className="mr-2 mt-1 text-primary" />
                    <span>Create your own final project</span>
                  </li>
                  <li className="flex items-start">
                    <LayersIcon size={14} className="mr-2 mt-1 text-primary" />
                    <span>See examples from other students</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* All Projects Section at the bottom */}
      {finalProjects.length > 0 && (
        <div id="all-projects" className="space-y-6 pt-8 mt-12 border-t">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <GraduationCapIcon size={22} className="mr-2" />
              All Final Deliverables
            </h2>
            <Badge variant="secondary" className="px-3 py-1">
              {finalProjects.length} Project{finalProjects.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Card className="hover:shadow-md transition-all border-muted/70 hover:border-primary/30 overflow-hidden flex flex-col h-full">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {thumbnailUrl ? (
                        <img 
                          src={thumbnailUrl} 
                          alt={`${project.title} screenshot`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">No preview available</span>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-0">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="py-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <GraduationCapIcon size={14} className="mr-1" />
                        <span>{project.student.name}</span>
                        {project.student.class && (
                          <span className="ml-1">({project.student.class})</span>
                        )}
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                          {/* Simple text extraction */}
                          {project.description.document[0]?.children?.[0]?.text || ""}
                        </p>
                      )}
                    </CardContent>
                    
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary/5 transition-colors pointer-events-none">
                        <div className="flex items-center justify-center">
                          <span className="mr-1">View Project</span>
                          <ChevronRightIcon size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export { LearningPathDetailPage };