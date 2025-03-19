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
  TagIcon,
  FolderIcon,
  InfoIcon
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";

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
    zipArchives?: Array<{
      id: string;
      description?: string;
      archive?: {
        filename: string;
        url: string;
        filesize: number;
      };
      extractedPath?: string;
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
  const [reflectionTab, setReflectionTab] = useState<string>("reflection");
  
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
  
  // Function to handle thumbnail click and navigate to that slide
  const handleThumbnailClick = (index: number) => {
    // This would require either:
    // 1. Implementing a custom carousel with slide index control
    // 2. Using a different carousel library with this capability
    // 3. Creating a custom implementation
    console.log(`Navigate to slide ${index}`);
    
    // For now, this is just a placeholder
    // In a real implementation, you would control the carousel's active slide
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
    
  // Check if there's an extracted zip archive to display
  const hasInteractiveContent = project.zipArchives && 
                              project.zipArchives.length > 0 && 
                              project.zipArchives.some(za => za.extractedPath);
  
  // Get the first extracted path that ends with .html for embedding
  const getInteractiveContent = () => {
    if (!project.zipArchives) return null;
    
    // First try to find any extractedPath that ends with .html
    const htmlArchive = project.zipArchives.find(za => 
      za.extractedPath && za.extractedPath.toLowerCase().endsWith('.html')
    );
    
    // If found, return that one
    if (htmlArchive) return htmlArchive.extractedPath;
    
    // Otherwise, return the first extractedPath available
    return project.zipArchives.find(za => za.extractedPath)?.extractedPath || null;
  };
  
  const interactiveContentUrl = getInteractiveContent();

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2">
            {project.languages.map((lang, index) => (
              <Badge key={index} variant="secondary">
                {lang.name}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Student/creator info */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <UserIcon size={14} />
            <span>{project.student.name}</span>
          </div>
          
          {project.student.class && (
            <div className="flex items-center gap-1.5">
              <span>•</span>
              <span>{project.student.class}</span>
            </div>
          )}
          
          {project.student.graduationYear && (
            <div className="flex items-center gap-1.5">
              <span>•</span>
              <GraduationCapIcon size={14} />
              <span>{project.student.graduationYear}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5">
            <span>•</span>
            <TagIcon size={14} />
            <span>{projectTypeLabels[project.projectType] || project.projectType}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span>•</span>
            <CalendarIcon size={14} />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {/* Brief description - first paragraph only */}
        <div className="text-muted-foreground">
          {project.description && project.description.document && project.description.document[0]?.children && (
            <div className="prose-sm dark:prose-invert max-w-none">
              <DocumentRenderer 
                document={[project.description.document[0]]} 
                renderers={renderers} 
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Media content - left side takes 2/3 */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive content (now first) */}
          {hasInteractiveContent && (
            <div className="relative border rounded-lg overflow-hidden">
              <div className="aspect-video bg-white">
                {interactiveContentUrl ? (
                  <iframe
                    src={getFullUrl(interactiveContentUrl)}
                    className="w-full h-full"
                    title={`${project.title} interactive content`}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    allowFullScreen
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No interactive content available</span>
                  </div>
                )}
              </div>
              
              {interactiveContentUrl && (
                <div className="flex justify-between items-center p-2 bg-muted/30">
                  <span className="text-sm font-medium">Interactive Demo</span>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <MaximizeIcon size={14} />
                          <span>Full Screen</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh]">
                        <div className="w-full h-full">
                          <iframe
                            src={getFullUrl(interactiveContentUrl)}
                            className="w-full h-full"
                            title={`${project.title} interactive content fullscreen`}
                            sandbox="allow-scripts allow-same-origin allow-popups"
                            allowFullScreen
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <a 
                      href={getFullUrl(interactiveContentUrl)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <ExternalLinkIcon size={14} />
                        <span>New Tab</span>
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Screenshots section (now below interactive demo) */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="space-y-3">
              {/* Main screenshot carousel */}
              <div className="rounded-lg overflow-hidden border">
                <Carousel className="w-full">
                  <CarouselContent>
                    {project.screenshots.map((screenshot, index) => (
                      screenshot.image && (
                        <CarouselItem key={screenshot.id || index}>
                          <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                            <img 
                              src={getFullUrl(screenshot.image.url)} 
                              alt={screenshot.caption || `Screenshot ${index + 1}`}
                              className="max-h-full object-contain"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                              }}
                            />
                            
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
                                <div className="w-full h-full flex items-center justify-center">
                                  <img 
                                    src={getFullUrl(screenshot.image.url)} 
                                    alt={screenshot.caption || `Screenshot ${index + 1}`}
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '100%',
                                      objectFit: 'contain'
                                    }}
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
              
              {/* Thumbnails gallery */}
              <div className="flex overflow-x-auto gap-2 pb-2">
                {project.screenshots.map((screenshot, index) => (
                  screenshot.image && (
                    <div 
                      key={`thumb-${screenshot.id || index}`}
                      className="flex-shrink-0 w-24 h-16 border rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        // You would need to implement a way to jump to a specific slide
                        // This might require customizing the Carousel component or using a different approach
                        console.log(`Jump to screenshot ${index + 1}`);
                      }}
                    >
                      <img 
                        src={getFullUrl(screenshot.image.url)} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {/* Video embed if available */}
          {project.embedCode && (
            <div className="relative border rounded-lg overflow-hidden">
              <div className="aspect-video bg-black">
                <div 
                  className="w-full h-full" 
                  dangerouslySetInnerHTML={{ __html: project.embedCode }} 
                />
              </div>
              
              <div className="flex justify-between items-center p-2 bg-muted/30">
                <span className="text-sm font-medium">Video Preview</span>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <MaximizeIcon size={14} />
                        <span>Full Screen</span>
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
                  
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <ExternalLinkIcon size={14} />
                        <span>New Tab</span>
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Demo URL iframe if available and no embed */}
          {project.demoUrl && !project.embedCode && (
            <div className="relative border rounded-lg overflow-hidden">
              <div className="aspect-video bg-white">
                <iframe
                  src={project.demoUrl}
                  className="w-full h-full"
                  title={`${project.title} demo`}
                  allowFullScreen
                />
              </div>
              
              <div className="flex justify-between items-center p-2 bg-muted/30">
                <span className="text-sm font-medium">Live Demo</span>
                
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ExternalLinkIcon size={14} />
                    <span>New Tab</span>
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar - right side 1/3 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assignment card */}
          {project.assignment && (
            <div className="bg-card rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpenIcon size={18} className="text-muted-foreground" />
                <h3 className="font-semibold">Assignment</h3>
              </div>
              
              <h4 className="font-medium">{project.assignment.title}</h4>
              <p className="text-sm text-muted-foreground">{getAssignmentSummary()}</p>
              
              <a 
                href={`/assignments/${project.assignment.title}`} 
                className="text-primary hover:underline text-sm inline-block"
              >
                View full assignment
              </a>
            </div>
          )}
          
          {/* Zip Archives */}
          {project.zipArchives && project.zipArchives.length > 0 && (
            <div className="bg-card rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FolderIcon size={18} className="text-muted-foreground" />
                <h3 className="font-semibold">Project Archives</h3>
              </div>
              
              <div className="space-y-3">
                {project.zipArchives.map((zipArchive, index) => (
                  zipArchive.archive && (
                    <div key={zipArchive.id || index} className="flex items-start">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{zipArchive.archive.filename}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(zipArchive.archive.filesize)}
                            </p>
                          </div>
                          <a href={getFullUrl(zipArchive.archive.url)} download className="ml-2">
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </a>
                        </div>
                        {zipArchive.description && (
                          <p className="text-xs mt-1">{zipArchive.description}</p>
                        )}
                        {zipArchive.extractedPath && !interactiveContentUrl && (
                          <a 
                            href={getFullUrl(zipArchive.extractedPath)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary hover:underline block mt-1"
                          >
                            View extracted files
                          </a>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {/* Code Files */}
          {project.codeFiles && project.codeFiles.length > 0 && project.codeFiles.some(cf => cf.file) && (
            <div className="bg-card rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileIcon size={18} className="text-muted-foreground" />
                <h3 className="font-semibold">Project Files</h3>
              </div>
              
              <div className="space-y-3">
                {project.codeFiles.map((codeFile, index) => (
                  codeFile.file && (
                    <div key={codeFile.id || index} className="flex items-start">
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
          )}
        </div>
      </div>
      
      {/* About This Project / Development Process section */}
      <div className="mt-8">
        <Tabs value={reflectionTab} onValueChange={setReflectionTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">
              <div className="flex items-center gap-2">
                <InfoIcon size={16} />
                <span>About This Project</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="reflection">
              <div className="flex items-center gap-2">
                <UserIcon size={16} />
                <span>Development Process</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none dark:prose-invert">
              <DocumentRenderer document={project.description.document} renderers={renderers} />
            </div>
          </TabsContent>
          
          <TabsContent value="reflection" className="mt-4">
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-lg font-semibold">
                    {project.student.name.charAt(0)}
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{project.student.name}'s Reflection</h3>
                  <p className="text-sm text-muted-foreground">Development process and challenges</p>
                </div>
              </div>
              
              <div className="prose-sm max-w-none dark:prose-invert">
                <p>
                  <em>Note: This section would display student reflections on the development process, challenges faced, lessons learned, and personal growth during the project. 
                  This could be added as a new field in your database schema.</em>
                </p>
                
                <p>
                  Example reflection content would go here. The student would write about their process, 
                  technical challenges they encountered, how they overcame obstacles, what they learned, 
                  and how they grew as a developer or designer through this project.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;