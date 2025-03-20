// src/components/assignment/assignment-header.tsx
import React from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { Assignment } from '@/types/assignment';

interface AssignmentHeaderProps {
  assignment: Assignment;
}

export function AssignmentHeader({ assignment }: AssignmentHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Track scroll position to create a compact header when scrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  return (
    <div className={`space-y-1 transition-all duration-200 ${isScrolled ? 'pb-1' : 'pb-2'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
        <h1 className={`font-bold tracking-tight transition-all duration-200 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>
          {assignment.title}
        </h1>
        
        {formattedDueDate && (
          <Badge variant="secondary" className="flex items-center whitespace-nowrap">
            <CalendarIcon size={14} className="mr-2" />
            Due: {formattedDueDate}
          </Badge>
        )}
      </div>
      
      {/* Brief description - first paragraph only - hide when scrolled */}
      {!isScrolled && assignment.description && assignment.description.document && assignment.description.document[0]?.children && (
        <div className="text-muted-foreground">
          <div className="prose-xs dark:prose-invert max-w-none">
            <DocumentRenderer 
              document={[assignment.description.document[0]]} 
            />
          </div>
        </div>
      )}
    </div>
  );
}