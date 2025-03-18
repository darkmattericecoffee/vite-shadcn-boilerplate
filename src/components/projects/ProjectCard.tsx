// src/components/projects/ProjectCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UserIcon, BookOpenIcon } from 'lucide-react';

// Define the backend API URL
const API_BASE_URL = 'http://localhost:3000'; // Make sure this matches your Keystone server

type ProjectCardProps = {
  id: string;
  title: string;
  student: {
    name: string;
    class?: string;
  };
  assignment?: {
    title: string;
  };
  languages: Array<{
    name: string;
  }>;
  projectType: string;
  thumbnailUrl?: string;
  createdAt: string;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  student,
  assignment,
  languages,
  projectType,
  thumbnailUrl,
  createdAt
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
  // Map project types to user-friendly names
  const projectTypeLabels: Record<string, string> = {
    'game': 'Game',
    'app': 'Application',
    'website': 'Website',
    'poster': 'Poster',
    'presentation': 'Presentation',
    'data_viz': 'Data Visualization',
    'other': 'Other'
  };

  // Get the full image URL by prepending the API base URL if it's a relative path
  const getFullImageUrl = (url?: string) => {
    if (!url) return undefined;
    
    // If the URL already starts with http:// or https://, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${url}`;
  };

  const fullThumbnailUrl = getFullImageUrl(thumbnailUrl);
  console.log(`Project: ${title}, Full Thumbnail URL:`, fullThumbnailUrl);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link to={`/projects/${id}`}>
        <div className="aspect-video relative bg-muted">
          {fullThumbnailUrl ? (
            <img 
              src={fullThumbnailUrl} 
              alt={title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Error loading image for ${title}:`, e);
                // Fall back to no preview message
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-muted-foreground">Image failed to load</span></div>`;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No preview available</span>
            </div>
          )}
          <Badge className="absolute top-2 right-2">
            {projectTypeLabels[projectType] || projectType}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-2 pb-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <UserIcon size={14} className="mr-1" />
            <span>{student.name}</span>
            {student.class && <span className="ml-1">({student.class})</span>}
          </div>
          
          {assignment && (
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpenIcon size={14} className="mr-1" />
              <span>{assignment.title}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon size={14} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex flex-wrap gap-1">
            {languages.map((lang, index) => (
              <Badge key={index} variant="outline">
                {lang.name}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};