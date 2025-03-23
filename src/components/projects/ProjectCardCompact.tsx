import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { GraduationCapIcon } from "lucide-react";
import { getFullUrl } from '@/lib/api';
import InitialsAvatar from '../ui/InitialsAvatar';



// Interface for the compact project card
interface ProjectCardCompactProps {
  project: any; // Using any to avoid type issues, can be refined later
  showImage?: boolean;
}

export function ProjectCardCompact({ project, showImage = true }: ProjectCardCompactProps) {
  if (!project) return null;
  
  // Get first screenshot as cover image
  const coverImage = project.screenshots && project.screenshots.length > 0 && project.screenshots[0].image
    ? getFullUrl(project.screenshots[0].image.url)
    : null;
  
  // Format the student names for display
  const getStudentDisplay = () => {
    // If there are no students, return empty string
    if (!project.students || project.students.length === 0) {
      return { name: 'Onbekend', class: '' };
    }
    
    // If there's just one student, show the full name and class
    if (project.students.length === 1) {
      const student = project.students[0];
      return { 
        name: student.name, 
        class: student.class?.name || '' 
      };
    }
    
    // If multiple students, show "Group Project (X students)"
    return { 
      name: `Samenwerking (${project.students.length})`, 
      class: '' 
    };
  };

  const studentDisplay = getStudentDisplay();

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block group"
    >
      <Card className="hover:shadow-md transition-all border-muted/70 hover:border-primary/30 overflow-hidden flex flex-col h-full">
        <div className="flex">
          {showImage && (
            <div className="w-1/3 bg-muted relative overflow-hidden aspect-square">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={`${project.title} screenshot`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <GraduationCapIcon size={24} className="text-muted-foreground opacity-50" />
                </div>
              )}
            </div>
          )}
          <div className={showImage ? "w-2/3 p-3" : "w-full p-3"}>
            <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
              {project.title}
            </h3>
            
            {/* Student information */}
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="line-clamp-1">{studentDisplay.name}</span>
              {studentDisplay.class && (
                <span className="ml-1 text-xs opacity-70">({studentDisplay.class})</span>
              )}
            </div>
            
            {/* Assignment information */}
            {project.assignment && (
              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                <span className="opacity-70">Opdracht: {project.assignment.title}</span>
              </div>
            )}
            
            {/* Display all student names if it's a group project */}
            {project.students && project.students.length > 1 && (
              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                <span className="opacity-70">
                  {project.students.map((s: { name: string }) => s.name).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}