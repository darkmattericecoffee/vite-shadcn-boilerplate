// src/components/assignment/assignment-header.tsx
import React from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ArrowLeftIcon } from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { getFullUrl } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AssignmentHeaderProps {
  assignment: Assignment;
  learningPathId?: string; // Optional prop to link back to the learning path
}

export function AssignmentHeader({ assignment, learningPathId }: AssignmentHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Track scroll position to create a compact header when scrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Format due date
  const formattedDueDate = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;
    
  // Check if assignment has screenshots that can be used as cover image
  const hasCoverImage = assignment.screenshots && 
    assignment.screenshots.length > 0 && 
    assignment.screenshots[0].image;
    
  // Get cover image URL from the first screenshot
  const coverImageUrl = hasCoverImage
    ? getFullUrl(assignment.screenshots?.[0]?.image?.url)
    : null;
  
  return (
    <div className={`sticky top-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-sm border-b ' : ''}`}>
      
      <div className="max-w-screen-2xl mx-auto">
        {/* Back button - only show when not scrolled */}
        {!isScrolled && learningPathId && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="mb-4 mt-4"
          >
            <Link to={`/learning-paths/${learningPathId}`} className="flex items-center">
              <ArrowLeftIcon size={16} className="mr-2" />
              Terug naar Leerpad
            </Link>
          </Button>
        )}
        
        {/* Hero section */}
        <div className="flex flex-col">
        {hasCoverImage && coverImageUrl ? (
            <div className={`w-full overflow-hidden relative transition-all duration-300 rounded-sm ${isScrolled ? 'h-16 md:h-20' : 'h-56 md:h-64 lg:h-80'}`}>
              {/* Container maintains aspect ratio while image stays fixed relative to viewport */}
              <div className="absolute inset-0">
                <img 
                  src={coverImageUrl} 
                  alt={`${assignment.title} cover`}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
              </div>
              
              {/* Content container scales with parent div but text stays the same size */}
              <div className="absolute bottom-0 left-0 p-4 w-full transition-all duration-300">
                <div className="flex items-center">
                  {isScrolled && learningPathId && (
                    <Button variant="ghost" size="sm" asChild className="mr-2 p-1 text-white">
                      <Link to={`/learning-paths/${learningPathId}`}>
                        <ArrowLeftIcon size={16} />
                      </Link>
                    </Button>
                  )}
                  <h1 className={`font-bold text-white drop-shadow-lg ${isScrolled ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl lg:text-4xl'}`}>
                    {assignment.title}
                  </h1>
                </div>
                
                {!isScrolled && (
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {formattedDueDate && (
                      <Badge variant="secondary" className="flex items-center bg-white/20 text-white border-none">
                        <CalendarIcon size={14} className="mr-2" />
                        Due: {formattedDueDate}
                      </Badge>
                    )}
                    
                    {assignment.learningObjectives && assignment.learningObjectives.length > 0 && (
                      <Badge variant="secondary" className="flex items-center bg-white/20 text-white border-none">
                        {assignment.learningObjectives.length} Leerdoel {assignment.learningObjectives.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Regular header without cover image - height controlled by padding
            <div className={`space-y-3 transition-all duration-300 ${isScrolled ? 'py-2 px-4' : 'py-4 pb-6 border-b'}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center">
                  {isScrolled && learningPathId && (
                    <Button variant="ghost" size="sm" asChild className="mr-2 p-1">
                      <Link to={`/learning-paths/${learningPathId}`}>
                        <ArrowLeftIcon size={16} />
                      </Link>
                    </Button>
                  )}
                  <h1 className={`font-bold tracking-tight ${isScrolled ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}>
                    {assignment.title}
                  </h1>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formattedDueDate && (
                    <Badge variant="secondary" className="flex items-center whitespace-nowrap">
                      <CalendarIcon size={14} className="mr-2" />
                      Deadline: {formattedDueDate}
                    </Badge>
                  )}
                  
                  {!isScrolled && assignment.learningObjectives && assignment.learningObjectives.length > 0 && (
                    <Badge variant="secondary" className="flex items-center whitespace-nowrap">
                      {assignment.learningObjectives.length} Leerdoel{assignment.learningObjectives.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Brief description - First paragraph - only show when not scrolled */}
        {!isScrolled && !hasCoverImage && assignment.description && assignment.description.document && assignment.description.document[0]?.children && (
          <div className="text-muted-foreground mt-4">
            <div className="prose dark:prose-invert max-w-none">
              <DocumentRenderer
                document={[assignment.description.document[0]]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}