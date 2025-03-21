// src/components/assignment/assignment-submissions.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, GraduationCapIcon, UserIcon, UsersIcon } from 'lucide-react';
import { getFullUrl } from '@/lib/api';
import { Assignment } from '@/types/assignment';

interface AssignmentSubmissionsProps {
  projects: Assignment['projects'];
}

export function AssignmentSubmissions({ projects }: AssignmentSubmissionsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <GraduationCapIcon size={18} className="mr-2" />
          Leerling inzending
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {projects.length} inzending{projects.length !== 1 ? 's' : ''}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            // Get thumbnail from first screenshot if available
            const thumbnailUrl = project.screenshots && 
              project.screenshots.length > 0 && 
              project.screenshots[0].image ? 
              getFullUrl(project.screenshots[0].image.url) : 
              undefined;
            
            // Get first paragraph or first 100 characters of description
            const getDescriptionExcerpt = () => {
              if (!project.description || !project.description.document) {
                return null;
              }

              // Try to extract text from the document
              let excerpt = '';
              try {
                // Look for the first paragraph
                for (const block of project.description.document) {
                  if (block.children) {
                    for (const child of block.children) {
                      if (child.text) {
                        excerpt += child.text + ' ';
                      }
                    }
                    if (excerpt) break; // Stop after first paragraph
                  }
                }
              } catch (error) {
                console.error('Error extracting text from description', error);
                return null;
              }

              // Truncate to ~100 characters if needed
              if (excerpt.length > 100) {
                return excerpt.substring(0, 100).trim() + '...';
              }
              return excerpt || null;
            };

            const descriptionExcerpt = getDescriptionExcerpt();

            // Format student information
            const formatStudentInfo = () => {
              // Check if students is available and is an array (new API structure)
              if (project.students && Array.isArray(project.students)) {
                // Multiple students case
                if (project.students.length > 1) {
                  return (
                    <div className="flex flex-col text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <UsersIcon size={14} className="mr-1" />
                        <span className="font-medium">Group Project</span>
                        <span className="ml-1">({project.students.length} students)</span>
                      </div>
                      <div className="text-xs mt-1">
                        {project.students.map((student, index) => (
                          <React.Fragment key={student.id || index}>
                            <span>{student.name}</span>
                            {project.students && index < project.students.length - 1 && <span>, </span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                }
                // Single student in the new format
                else if (project.students.length === 1) {
                  const student = project.students[0];
                  return (
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <UserIcon size={14} className="mr-1" />
                      <span>{student.name}</span>
                      {student.class && (
                        <span className="ml-1">({student.class.name})</span>
                      )}
                    </div>
                  );
                }
              }
              
              // Fallback to old API structure (single student)
              if (project.student) {
                return (
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <UserIcon size={14} className="mr-1" />
                    <span>{project.student.name}</span>
                    {project.student.class && (
                      <span className="ml-1">({typeof project.student.class === 'string' ? project.student.class : (project.student.class as { name: string }).name})</span>
                    )}
                  </div>
                );
              }
              
              // No student information available
              return null;
            };

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
                        onError={(e) => {
                          console.error(`Error loading image:`, e);
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-muted-foreground">No preview available</span></div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">Geen voorvertoning beschikbaar</span>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 flex-grow">
                    {formatStudentInfo()}
                    
                    {descriptionExcerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {descriptionExcerpt}
                      </p>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full pointer-events-none">
                      <div className="flex items-center justify-center">
                        <ChevronRightIcon size={16} className="mr-2" />
                        Toon project
                      </div>
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}