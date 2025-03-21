// src/components/projects/ProjectCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRightIcon, 
  CodeIcon, 
  ExternalLinkIcon, 
  GraduationCapIcon,
  LayersIcon,
  StarIcon,
  BookOpenIcon,
  UsersIcon
} from "lucide-react";
import { getFullUrl } from '@/lib/api';
import InitialsAvatar from '../ui/InitialsAvatar';

// Define the Project interface - updated to support multiple students
interface Project {
  id: string;
  title: string;
  description?: {
    document: any;
  } | null;
  projectType?: string;
  demoUrl?: string;
  featured?: boolean;
  students?: {
    id: string;
    name: string;
    class?: {
      name: string;
    };
  }[];
  assignment?: {
    id: string;
    title: string;
  };
  learningPath?: {
    id: string;
    title: string;
  };
  languages?: {
    id: string;
    name: string;
  }[];
  screenshots?: {
    id: string;
    image: {
      url: string;
    };
  }[];
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Safety check - ensure all required properties exist
  if (!project) return null;
  
  // Get first screenshot as cover image
  const coverImage = project.screenshots && project.screenshots.length > 0 && project.screenshots[0].image
    ? getFullUrl(project.screenshots[0].image.url)
    : null;
  
  // Helper function to get a simple excerpt from description
  const getExcerpt = (document: any) => {
    if (!document) return '';
    
    try {
      // Extract first paragraph text content
      if (document.content) {
        const paragraph = document.content.find((node: any) => node.type === 'paragraph');
        if (paragraph && paragraph.content) {
          const text = paragraph.content
            .filter((node: any) => node.type === 'text')
            .map((node: any) => node.text)
            .join('');
          
          return text.length > 120 ? text.substring(0, 120) + '...' : text;
        }
      }
    } catch (e) {
      console.error('Error extracting text from document', e);
    }
    
    return '';
  };
  
  // Get project type display name
  const getProjectTypeName = (type: string = 'other') => {
    switch (type) {
      case 'game': return 'Game';
      case 'app': return 'Application';
      case 'website': return 'Website';
      case 'poster': return 'Poster';
      case 'presentation': return 'Presentation';
      case 'data_viz': return 'Data Visualization';
      default: return type;
    }
  };

  // Format the student names for display
  const formatStudentInfo = () => {
    // If there are no students, return empty string
    if (!project.students || project.students.length === 0) {
      return '';
    }
    
    // If there's just one student, show the full name and class
    if (project.students.length === 1) {
      const student = project.students[0];
      return (
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <InitialsAvatar name={student.name} size='s' />
          <span className="ml-1">{student.name}</span>
          {student.class && (
            <span className="ml-1 text-xs opacity-70">({student.class.name})</span>
          )}
        </div>
      );
    }
    
    // If there are multiple students, handle the display differently
    return (
      <div className="flex flex-col text-sm text-muted-foreground mb-3">
        <div className="flex items-center mb-1">
          <UsersIcon size={14} className="mr-1" />
          <span className="font-medium">Group Project</span>
          <span className="ml-1 text-xs opacity-70">({project.students.length} students)</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {project.students.map((student, index) => (
            <div key={student.id} className="flex items-center">
              <InitialsAvatar name={student.name} size='s' />
              <span className="ml-1 text-xs">{student.name}</span>
              {index < project.students!.length - 1 && <span className="ml-1">+</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Link to={`/projects/${project.id}`} className="block group">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        {/* Card media area with title overlay */}
        <div className="relative aspect-video bg-muted">
          {coverImage ? (
            <img 
              src={coverImage}
              alt={`${project.title} screenshot`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CodeIcon size={40} className="text-muted-foreground opacity-30" />
            </div>
          )}
          
          {/* Title overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-medium text-lg">{project.title}</h3>
          </div>
          
          {/* Top badges area */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {/* Featured badge */}
            {project.featured && (
              <Badge variant="default" className="flex items-center gap-1">
                <StarIcon size={12} />
                <span>Uitgelicht</span>
              </Badge>
            )}
            
            {/* Project type badge */}
            {project.projectType && (
              <Badge variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm">
                {getProjectTypeName(project.projectType)}
              </Badge>
            )}
            
            {/* Group project indicator badge */}
            {project.students && project.students.length > 1 && (
              <Badge variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm flex items-center gap-1">
                <UsersIcon size={10} />
                <span>Groep</span>
              </Badge>
            )}
            
            {/* Programming languages (limited to 2 in the image) */}
            {project.languages && project.languages.length > 0 && (
              project.languages.slice(0, 2).map(language => (
                <Badge key={language.id} className="text-xs bg-background/80 backdrop-blur-sm text-indigo-900 border-none">
                  {language.name}
                </Badge>
              ))
            )}
          </div>
        </div>
        
        {/* Card content */}
        <CardContent className="flex-grow pt-4">
          {/* Student info - now with support for multiple students */}
          {formatStudentInfo()}
          
          {/* Project description excerpt */}
          {project.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {getExcerpt(project.description.document)}
            </p>
          )}
          
          {/* Learning path and assignment on same level */}
          {(project.learningPath || project.assignment) && (
            <div className="mb-3 border-l-2 border-muted pl-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {project.learningPath && (
                  <div className="flex items-center">
                    <LayersIcon size={14} className="mr-1 flex-shrink-0" />
                    <span className="truncate font-medium">{project.learningPath.title}</span>
                  </div>
                )}
                
                {project.assignment && (
                  <div className="flex items-center">
                    <BookOpenIcon size={14} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{project.assignment.title}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* All programming languages (if more than shown in the image) */}
          {project.languages && project.languages.length > 2 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {project.languages.slice(0, 5).map(language => (
                <Badge key={language.id} className="text-xs bg-purple-800 text-white">
                  {language.name}
                </Badge>
              ))}
              {project.languages.length > 5 && (
                <Badge className="text-xs bg-purple-500/70 text-white">
                  +{project.languages.length - 5} meer
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        
        {/* Card footer */}
        <CardFooter>
          <div className="w-full flex items-center gap-2">
            <Button variant="default" className="flex-1 pointer-events-none">
              <div className="flex items-center justify-center">
                <ChevronRightIcon size={16} className="mr-2" />
                Bekijk Project
              </div>
            </Button>
            
            {project.demoUrl && (
              <Button
                variant="outline"
                size="icon"
                className="flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.demoUrl, '_blank');
                }}
              >
                <ExternalLinkIcon size={16} />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}