// src/components/project/project-header.tsx
import React from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { Project } from '@/types/project';
import InitialsAvatar from '../ui/InitialsAvatar';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Track scroll position to create a compact header when scrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Format submission date
  const formattedSubmissionDate = project.submissionDate 
    ? new Date(project.submissionDate).toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  return (
    <div className={`space-y-1 transition-all duration-200 ${isScrolled ? 'pb-1' : 'pb-2'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
        <h1 className={`font-bold tracking-tight transition-all duration-200 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>
          {project.title}
        </h1>
        
        <div className="flex flex-wrap gap-2">
          {/* Student badge */}
          <Badge variant="secondary" className="flex items-center whitespace-nowrap">
            <InitialsAvatar name={project.student.name} size='s' />
            
            {project.student.name}
            {project.student.class && (
              <span className="ml-1">({project.student.class})</span>
            )}
          </Badge>
          
          {/* Submission date badge */}
          {formattedSubmissionDate && (
            <Badge variant="outline" className="flex items-center whitespace-nowrap">
              <CalendarIcon size={14} className="mr-2" />
              Submitted: {formattedSubmissionDate}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Brief description - first paragraph only - hide when scrolled */}
      {!isScrolled && project.description && project.description.document && project.description.document[0]?.children && (
        <div className="text-muted-foreground">
          <div className="prose-xs dark:prose-invert max-w-none">
            <DocumentRenderer 
              document={[project.description.document[0]]} 
            />
          </div>
        </div>
      )}
    </div>
  );
}