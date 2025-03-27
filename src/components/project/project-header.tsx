// src/components/project/project-header.tsx
import React from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { Project } from '@/types/project';
import { getFullUrl } from '@/lib/api';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Handle both students (array) or legacy student (single object)
  const projectStudents = project.students || (project.student ? [project.student] : []);
  
  // Track scroll position to add background and border when scrolled
  React.useEffect(() => {
    let timeoutId: number;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsScrolled(window.scrollY > 100);
      }, 50); // adjust delay as needed
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Format submission date
  const formattedSubmissionDate = project.submissionDate
    ? new Date(project.submissionDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;
    
  // Helper for class name display
  const getClassName = (student: any) => {
    if (!student) return null;
    if (typeof student.class === 'string') return student.class;
    if (student.class?.name) return student.class.name;
    return null;
  };
  
  // Check if project has screenshots that can be used as cover image
  const hasCoverImage = project.screenshots && 
    project.screenshots.length > 0 && 
    project.screenshots[0].image;
    
  // Get cover image URL from the first screenshot
  const coverImageUrl = hasCoverImage
    ? getFullUrl(project.screenshots?.[0]?.image?.url)
    : null;
  
  return (
    <div className={`transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-sm border-b' : ''}`}>
      <div className="max-w-screen-2xl mx-auto">
        {/* Hero section */}
        <div className="flex flex-col">
          {hasCoverImage && coverImageUrl ? (
            <div 
              className={`w-full overflow-hidden relative transition-all duration-300 rounded-sm ${
                isScrolled ? 'h-16 md:h-20' : 'h-64 lg:h-80'
              }`}
            >
              {/* Container for the image - always maintains the same position and aspect ratio */}
              <div className="absolute inset-0">
                <img 
                  src={coverImageUrl} 
                  alt={`${project.title} cover`}
                  className={`w-full object-cover transition-all duration-300 ${
                    isScrolled ? 'object-top h-48 md:h-60' : 'h-full'
                  }`}
                />
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
              </div>
              
              {/* Content container - position changes based on scroll state */}
              <div className={`absolute transition-all duration-300 w-full ${
                isScrolled ? 'bottom-0 left-0 p-2 flex items-center' : 'bottom-0 left-0 p-4'
              }`}>
                {isScrolled ? (
                  // Compact layout for scrolled state
                  <div className="flex items-center justify-between w-full">
                    <h1 className="font-bold text-white drop-shadow-sm text-lg truncate mr-4">
                      {project.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {formattedSubmissionDate && (
                        <Badge variant="secondary" className="flex items-center bg-white/20 text-white border-none text-xs">
                          <CalendarIcon size={12} className="mr-1" />
                          {formattedSubmissionDate}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  // Full layout for non-scrolled state
                  <>
                    <div className="flex items-center">
                      <h1 className="font-bold text-white drop-shadow-lg text-3xl lg:text-4xl">
                        {project.title}
                      </h1>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {formattedSubmissionDate && (
                        <Badge variant="secondary" className="flex items-center bg-white/20 text-white border-none">
                          <CalendarIcon size={14} className="mr-2" />
                          {formattedSubmissionDate}
                        </Badge>
                      )}
                      
                      {projectStudents && projectStudents.length > 0 && (
                        <Badge variant="secondary" className="flex items-center bg-white/20 text-white border-none">
                          {projectStudents.length} Leerling{projectStudents.length !== 1 ? 'en' : ''}
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            // Regular header without cover image - height changes less dramatically
            <div className={`space-y-2 transition-all duration-300 rounded-sm ${
              isScrolled ? 'py-2 px-4' : 'py-4 pb-6 border-b'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center">
                  <h1 className={`font-bold tracking-tight transition-all duration-300 ${
                    isScrolled ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'
                  }`}>
                    {project.title}
                  </h1>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formattedSubmissionDate && (
                    <Badge variant="secondary" className="flex items-center whitespace-nowrap">
                      <CalendarIcon size={14} className="mr-2" />
                      {formattedSubmissionDate}
                    </Badge>
                  )}
                  
                  {!isScrolled && projectStudents && projectStudents.length > 0 && (
                    <Badge variant="secondary" className="flex items-center whitespace-nowrap">
                      {projectStudents.length} Student{projectStudents.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Brief description - only visible when not scrolled */}
        {!isScrolled && !hasCoverImage && project.description && project.description.document && project.description.document[0]?.children && (
          <div className="text-muted-foreground mt-4">
            <div className="prose dark:prose-invert max-w-none">
              <DocumentRenderer
                document={[project.description.document[0]]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}