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
  BookOpenIcon 
} from "lucide-react";
import { getFullUrl } from '@/lib/api';

// Define the Project interface - update with learning path information
interface Project {
  id: string;
  title: string;
  description?: {
    document: any;
  } | null;
  projectType?: string;
  demoUrl?: string;
  featured?: boolean;
  student?: {
    id: string;
    name: string;
    class?: string;
  };
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

  return (
    <Link to={`/projects/${project.id}`} className="block group">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        {/* Card media area */}
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
          
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="flex items-center gap-1">
                <StarIcon size={12} />
                <span>Featured</span>
              </Badge>
            </div>
          )}
          
          {/* Learning Path badge */}
          {project.learningPath && (
            <div className="absolute top-2 right-2">
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 bg-background/80 backdrop-blur-sm"
              >
                <LayersIcon size={12} />
                <span>{project.learningPath.title}</span>
              </Badge>
            </div>
          )}
        </div>
        
        {/* Card header */}
        <CardHeader className="pb-2">
          <CardTitle className="group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
        </CardHeader>
        
        {/* Card content */}
        <CardContent className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Project type badge */}
            {project.projectType && (
              <Badge variant="outline" className="text-xs">
                {getProjectTypeName(project.projectType)}
              </Badge>
            )}
            
            {/* Student info */}
            {project.student && (
              <div className="flex items-center text-sm text-muted-foreground ml-auto">
                <GraduationCapIcon size={14} className="mr-1" />
                <span>{project.student.name}</span>
                {project.student.class && (
                  <span className="ml-1 text-xs opacity-70">({project.student.class})</span>
                )}
              </div>
            )}
          </div>
          
          {/* Project description excerpt */}
          {project.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {getExcerpt(project.description.document)}
            </p>
          )}
          
          {/* Assignment and learning path info */}
          <div className="space-y-1 mb-3">
            {project.assignment && (
              <div className="flex items-center text-xs text-muted-foreground">
                <BookOpenIcon size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">Assignment: {project.assignment.title}</span>
              </div>
            )}
            
            {project.learningPath && !project.assignment && (
              <div className="flex items-center text-xs text-muted-foreground">
                <LayersIcon size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">Learning Path: {project.learningPath.title}</span>
              </div>
            )}
          </div>
          
          {/* Programming languages */}
          {project.languages && project.languages.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {project.languages.slice(0, 3).map(language => (
                <Badge key={language.id} variant="secondary" className="text-xs">
                  {language.name}
                </Badge>
              ))}
              {project.languages.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.languages.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        
        {/* Card footer */}
        <CardFooter className="pt-0">
          <div className="w-full flex items-center gap-2">
            <Button variant="default" className="flex-1 pointer-events-none">
              <div className="flex items-center justify-center">
                <ChevronRightIcon size={16} className="mr-2" />
                View Project
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