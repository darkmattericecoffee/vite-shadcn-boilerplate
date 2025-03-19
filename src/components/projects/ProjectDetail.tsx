// src/components/projects/ProjectDetail.tsx
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserIcon, 
  CalendarIcon, 
  FileIcon,
  ExternalLinkIcon,
  BookOpenIcon,
  MaximizeIcon,
  GraduationCapIcon,
  TagIcon
} from 'lucide-react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from '@/components/ui/separator';

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
      graduationYear?: number;
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
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  
  // Get first sentence or first 150 characters (whichever is shorter) for summary
  const getAssignmentSummary = () => {
    if (!project.assignment?.description || 
        !project.assignment.description.document || 
        !project.assignment.description.document[0]?.children) {
      return 'No assignment description available';
    }

    // Try to extract text from the assignment document
    let fullText = '';
    try {
      project.assignment.description.document.forEach((block: any) => {
        if (block.children) {
          block.children.forEach((child: any) => {
            if (child.text) {
              fullText += child.text + ' ';
            }
          });
        }
      });
    } catch (error) {
      console.error('Error extracting text from assignment description', error);
      return 'Error extracting assignment description';
    }

    // Get first sentence or truncate
    const firstSentence = fullText.split(/[.!?]/).filter(s => s.trim().length > 0)[0];
    if (firstSentence && firstSentence.length < 150) {
      return firstSentence + '...';
    }
    return fullText.substring(0, 150) + '...';
  };
  
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

  // Get the first screenshot for featured display
  const featuredScreenshot = project.screenshots && project.screenshots.length > 0 && project.screenshots[0].image 
    ? getFullUrl(project.screenshots[0].image.url) 
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content area - left side on desktop */}
      <div className="flex-grow lg:w-2/3 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{project.title}</h1>
        
        {/* Featured screenshot or carousel */}
        {project.screenshots && project.screenshots.length > 0 && project.screenshots.some(s => s.image) && (
          <div className="relative rounded-lg overflow-hidden border">
            <div className="bg-muted aspect-video">
              <Carousel className="w-full">
                <CarouselContent>
                  {project.screenshots.map((screenshot, index) => (
                    screenshot.image && (
                      <CarouselItem key={screenshot.id || index}>
                        <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                          <img 
                            src={getFullUrl(screenshot.image.url)} 
                            alt={screenshot.caption || `Screenshot ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => console.error(`Error loading image:`, e)}
                          />
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="absolute bottom-4 right-4 bg-background/80 hover:bg-background"
                                onClick={() => setSelectedScreenshot(getFullUrl(screenshot.image?.url) || null)}
                              >
                                <MaximizeIcon size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl w-full h-[80vh]">
                              <div className="w-full h-full flex items-center justify-center">
                                <img 
                                  src={getFullUrl(screenshot.image.url)} 
                                  alt={screenshot.caption || `Screenshot ${index + 1}`}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
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
          </div>
        )}
        
        {/* Live demo section */}
        {(project.demoUrl || project.embedCode) && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Live Demo</h2>
            
            {project.embedCode && (
              <div className="relative border rounded-lg overflow-hidden">
                <div className="aspect-video bg-black">
                  <div 
                    className="w-full h-full" 
                    dangerouslySetInnerHTML={{ __html: project.embedCode }} 
                  />
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute bottom-4 right-4 bg-background/80 hover:bg-background"
                    >
                      <MaximizeIcon size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh]">
                    <div className="w-full h-full">
                      <div 
                        className="w-full h-full" 
                        dangerouslySetInnerHTML={{ __html: project.embedCode }} 
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            
            {project.demoUrl && !project.embedCode && (
              <div className="relative border rounded-lg overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    src={project.demoUrl}
                    className="w-full h-full"
                    title={`${project.title} demo`}
                    allowFullScreen
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="absolute bottom-4 right-4 bg-background/80 hover:bg-background flex items-center gap-2"
                  onClick={() => window.open(project.demoUrl, '_blank')}
                >
                  <ExternalLinkIcon size={16} />
                  <span>Open in New Tab</span>
                </Button>
              </div>
            )}
            
            {project.demoUrl && project.embedCode && (
              <div className="mt-4">
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="flex items-center gap-2">
                    <ExternalLinkIcon size={16} />
                    <span>Open Demo in New Tab</span>
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}
        
        {/* Project Description */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Project Description</h2>
          <div className="prose max-w-none dark:prose-invert">
            <DocumentRenderer document={project.description.document} renderers={renderers} />
          </div>
        </div>
      </div>
      
      {/* Sidebar - right side on desktop */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-card rounded-lg border p-6 space-y-5">
          {/* Project metadata */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Project Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserIcon size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Creator</h4>
                  <p>{project.student.name}</p>
                  {project.student.class && (
                    <p className="text-sm text-muted-foreground">{project.student.class}</p>
                  )}
                </div>
              </div>
              
              {project.student.graduationYear && (
                <div className="flex items-start gap-3">
                  <GraduationCapIcon size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Graduation Year</h4>
                    <p>{project.student.graduationYear}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <TagIcon size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Project Type</h4>
                  <p>{projectTypeLabels[project.projectType] || project.projectType}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CalendarIcon size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Created</h4>
                  <p>{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Technologies */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.languages.map((lang, index) => (
                <Badge key={index} variant="secondary">
                  {lang.name}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Assignment */}
          {project.assignment && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Assignment</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <BookOpenIcon size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{project.assignment.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{getAssignmentSummary()}</p>
                      <a 
                        href={`/assignments/${project.assignment.title}`} 
                        className="text-primary hover:underline text-sm mt-2 inline-block"
                      >
                        View full assignment
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Code Files */}
          {project.codeFiles && project.codeFiles.length > 0 && project.codeFiles.some(cf => cf.file) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Project Files</h3>
                <div className="space-y-3">
                  {project.codeFiles.map((codeFile, index) => (
                    codeFile.file && (
                      <div key={codeFile.id || index} className="flex items-start">
                        <FileIcon size={18} className="mr-3 text-muted-foreground mt-0.5" />
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{codeFile.file.filename}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(codeFile.file.filesize)}
                              </p>
                            </div>
                            <a href={getFullUrl(codeFile.file.url)} download className="ml-2">
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </a>
                          </div>
                          {codeFile.description && (
                            <p className="text-xs mt-1">{codeFile.description}</p>
                          )}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;