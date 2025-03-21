// src/components/assignment/assignment-sidebar.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  ListTodoIcon, 
  FileIcon, 
  ImageIcon, 
  CalendarIcon, 
  ChevronRightIcon,
  GraduationCapIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getFullUrl } from '@/lib/api';
import { Assignment } from '@/types/assignment';

interface AssignmentSidebarProps {
  assignment: Assignment;
  onSectionChange: (section: string) => void;
}

export function AssignmentSidebar({ assignment, onSectionChange }: AssignmentSidebarProps) {
  // Format due date
  const formattedDueDate = assignment.dueDate 
    ? new Date(assignment.dueDate).toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const hasFiles = Boolean(assignment.files && assignment.files.length > 0);
  const hasScreenshots = Boolean(assignment.screenshots && assignment.screenshots.length > 0);
  const hasProjects = Boolean(assignment.projects && assignment.projects.length > 0);
  
  // Get the primary screenshot if available
  const featuredScreenshot = hasScreenshots && assignment.screenshots![0].image 
    ? getFullUrl(assignment.screenshots![0].image.url) 
    : null;

  // Get the primary file if available (prefer PDFs or presentations for display)
  const getFeaturedFile = () => {
    if (!hasFiles) return null;
    
    // First try to find a PDF or presentation file
    const preferredFile = assignment.files!.find(file => 
      file.file && (file.fileType === 'pdf' || file.fileType === 'ppt')
    );
    
    // If found, return that
    if (preferredFile && preferredFile.file) return preferredFile;
    
    // Otherwise return the first file
    return assignment.files![0].file ? assignment.files![0] : null;
  };
  
  const featuredFile = getFeaturedFile();

  return (
    <>
      {/* Assignment resources card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <ListTodoIcon size={18} className="mr-2" />
            Benodigdheden
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* If we have a featured screenshot, show it */}
          {featuredScreenshot && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Voorbeeld</h3>
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <img 
                  src={featuredScreenshot} 
                  alt="Assignment Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              {hasScreenshots && assignment.screenshots!.length > 1 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => onSectionChange("screenshots")}
                >
                  Bekijk alle {assignment.screenshots!.length} screenshots
                </Button>
              )}
            </div>
          )}
          
          {/* If we have a featured file, add a preview card */}
            {featuredFile && featuredFile.file && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Hoofd Document</h3>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  onClick={() => onSectionChange("files")}
                >
                  <div className="flex items-center">
                    <FileIcon size={16} className="mr-2" />
                    <span className="max-w-xs truncate">
                      {featuredFile.title || featuredFile.file.filename}
                    </span>
                  </div>
                  <ChevronRightIcon size={16} />
                </Button>
              </div>
            )}
          
          {/* Generic resource counts */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">Bestanden</h3>
            <div className="grid grid-cols-2 gap-2">
              {hasFiles && (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start"
                  onClick={() => onSectionChange("files")}
                >
                  <FileIcon size={16} className="mr-2" />
                  <span>{assignment.files!.length} File{assignment.files!.length !== 1 ? 's' : ''}</span>
                </Button>
              )}
              
              {hasScreenshots && (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start"
                  onClick={() => onSectionChange("screenshots")}
                >
                  <ImageIcon size={16} className="mr-2" />
                  <span>{assignment.screenshots!.length} Afbeelding{assignment.screenshots!.length !== 1 ? 's' : ''}</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Due date reminder card */}
          {formattedDueDate && (
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Due Date</h3>
              <div className="flex items-center p-3 bg-muted rounded-md">
                <CalendarIcon size={18} className="mr-2 text-muted-foreground" />
                <span>{formattedDueDate}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Student submissions summary */}
      {hasProjects && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <GraduationCapIcon size={18} className="mr-2" />
              Inzendingen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Alle inzendingen</span>
              <Badge variant="secondary">{assignment.projects!.length}</Badge>
            </div>
            
            <Button 
              className="w-full" 
              variant="default"
              onClick={() => onSectionChange("submissions")}
            >
              Toon alle inzendingen
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}