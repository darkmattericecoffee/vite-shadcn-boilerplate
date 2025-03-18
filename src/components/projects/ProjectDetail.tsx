// src/components/projects/ProjectDetail.tsx - with fixed image URLs
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserIcon, 
  CalendarIcon, 
  FileIcon,
  ExternalLinkIcon,
  BookOpenIcon
} from 'lucide-react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Define the backend API URL
const API_BASE_URL = 'http://localhost:3000'; // Make sure this matches your Keystone server

// Helper function to get the full URL for images or files
const getFullUrl = (url?: string) => {
  if (!url) return undefined;
  
  // If the URL already starts with http:// or https://, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${url}`;
};

type ProjectDetailProps = {
  project: {
    id: string;
    title: string;
    description: {
      document: any; // This should be the Keystone document format
    };
    student: {
      name: string;
      class?: string;
    };
    assignment?: {
      title: string;
      description?: {
        document: any;
      };
    };
    languages: Array<{
      name: string;
    }>;
    projectType: string;
    screenshots?: Array<{
      id: string;
      caption?: string;
      image?: {
        url: string;
        width?: number;
        height?: number;
        filesize?: number;
      };
    }>;
    codeFiles?: Array<{
      id: string;
      description?: string;
      file?: {
        filename: string;
        url: string;
        filesize: number;
      };
    }>;
    demoUrl?: string;
    embedCode?: string;
    createdAt: string;
  };
};

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState('info');
  const formattedDate = new Date(project.createdAt).toLocaleDateString();
  
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

  // Custom renderers for the document field
  const renderers = {
    // Add custom renderers for document components if needed
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center text-muted-foreground">
            <UserIcon size={16} className="mr-1.5" />
            <span>{project.student.name}</span>
            {project.student.class && (
              <span className="ml-1">({project.student.class})</span>
            )}
          </div>
          
          {project.assignment && (
            <div className="flex items-center text-muted-foreground">
              <BookOpenIcon size={16} className="mr-1.5" />
              <span>{project.assignment.title}</span>
            </div>
          )}
          
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon size={16} className="mr-1.5" />
            <span>{formattedDate}</span>
          </div>
          
          <Badge className="ml-auto">
            {projectTypeLabels[project.projectType] || project.projectType}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {project.languages.map((lang, index) => (
            <Badge key={index} variant="outline">
              {lang.name}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Project screenshots carousel */}
      {project.screenshots && project.screenshots.length > 0 && project.screenshots.some(s => s.image) && (
        <div className="mt-6">
          <Carousel className="w-full">
            <CarouselContent>
              {project.screenshots.map((screenshot, index) => (
                screenshot.image && (
                  <CarouselItem key={screenshot.id || index}>
                    <div className="bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <img 
                        src={getFullUrl(screenshot.image.url)} 
                        alt={screenshot.caption || `Screenshot ${index + 1}`}
                        className="max-w-full max-h-full object-contain" 
                        onError={(e) => console.error(`Error loading image:`, e)}
                      />
                    </div>
                    {screenshot.caption && (
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        {screenshot.caption}
                      </p>
                    )}
                  </CarouselItem>
                )
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="info">Project Info</TabsTrigger>
          <TabsTrigger value="files">Code Files</TabsTrigger>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
        </TabsList>
        
        {/* Project Info Tab */}
        <TabsContent value="info" className="mt-4">
          <div className="prose max-w-none dark:prose-invert">
            <DocumentRenderer document={project.description.document} renderers={renderers} />
          </div>
        </TabsContent>
        
        {/* Code Files Tab */}
        <TabsContent value="files" className="mt-4">
          {project.codeFiles && project.codeFiles.length > 0 && project.codeFiles.some(cf => cf.file) ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Project Files</h3>
              <div className="border rounded-lg divide-y">
                {project.codeFiles.map((codeFile, index) => (
                  codeFile.file && (
                    <div key={codeFile.id || index} className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <FileIcon size={20} className="mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{codeFile.file.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(codeFile.file.filesize)}
                          </p>
                          {codeFile.description && (
                            <p className="text-sm mt-1">{codeFile.description}</p>
                          )}
                        </div>
                      </div>
                      <a href={getFullUrl(codeFile.file.url)} download>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </a>
                    </div>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No code files available for this project.
            </div>
          )}
        </TabsContent>
        
        {/* Live Demo Tab */}
        <TabsContent value="demo" className="mt-4">
          {project.demoUrl || project.embedCode ? (
            <div className="space-y-4">
              {project.demoUrl && (
                <div className="mb-4">
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Button className="flex items-center gap-2">
                      <ExternalLinkIcon size={16} />
                      <span>Open Live Demo</span>
                    </Button>
                  </a>
                </div>
              )}
              
              {project.embedCode && (
                <div className="border rounded-lg p-4 bg-black aspect-video">
                  <div 
                    className="w-full h-full" 
                    dangerouslySetInnerHTML={{ __html: project.embedCode }} 
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No live demo available for this project.
            </div>
          )}
        </TabsContent>
        
        {/* Assignment Tab */}
        <TabsContent value="assignment" className="mt-4">
          {project.assignment ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{project.assignment.title}</h3>
              
              {project.assignment.description && (
                <div className="prose max-w-none dark:prose-invert mt-4">
                  <DocumentRenderer 
                    document={project.assignment.description.document} 
                    renderers={renderers} 
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No assignment information available.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;