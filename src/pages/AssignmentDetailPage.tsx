// src/pages/AssignmentDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { getAssignmentById, getFullUrl } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ArrowLeftIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  ChevronRightIcon,
  ZoomInIcon,
  PinIcon,
  UserIcon,
  ListTodoIcon,
  GraduationCapIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UniversalFileViewer } from '@/components/viewer/universal-file-viewer';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const AssignmentDetailPage = () => {
  interface Assignment {
    id: string;
    title: string;
    description?: {
      document: any;
    };
    dueDate?: string;
    files?: Array<{
      id: string;
      title?: string;
      description?: string;
      fileType?: string;
      file?: {
        filename: string;
        url: string;
        filesize?: number;
      };
    }>;
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
    projects?: Array<{
      id: string;
      title: string;
      description?: {
        document: any;
      };
      student: {
        name: string;
        class?: string;
      };
      screenshots?: Array<{
        image?: {
          url: string;
        };
      }>;
    }>;
  }
  
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("content");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await getAssignmentById(id!);
        setAssignment(data.assignment);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setError('Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssignment();
    } else {
      setError('Assignment ID is missing');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 bg-muted animate-pulse rounded mb-6"></div>
        <div className="h-24 bg-muted animate-pulse rounded"></div>
        <div className="h-64 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">{error || 'Assignment not found'}</p>
        <Button asChild className="mt-4">
          <Link to="/assignments">Back to Assignments</Link>
        </Button>
      </div>
    );
  }

  // Format due date
  const formattedDueDate = assignment.dueDate 
    ? new Date(assignment.dueDate).toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const hasScreenshots = assignment.screenshots && assignment.screenshots.length > 0;
  const hasFiles = assignment.files && assignment.files.length > 0;
  const hasProjects = assignment.projects && assignment.projects.length > 0;
  
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
    <div className="space-y-8">
      <Button 
        variant="outline" 
        size="sm" 
        asChild 
        className="mb-4"
      >
        <Link to="/assignments" className="flex items-center">
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Assignments
        </Link>
      </Button>
      
      {/* Hero section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
          
          {formattedDueDate && (
            <Badge variant="secondary" className="flex items-center whitespace-nowrap">
              <CalendarIcon size={14} className="mr-2" />
              Due: {formattedDueDate}
            </Badge>
          )}
        </div>
        
        {/* Brief description - first paragraph only */}
        {assignment.description && assignment.description.document && assignment.description.document[0]?.children && (
          <div className="text-muted-foreground">
            <div className="prose-sm dark:prose-invert max-w-none">
              <DocumentRenderer 
                document={[assignment.description.document[0]]} 
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Media content - left side takes 2/3 */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="content" className="flex items-center">
                <BookOpenIcon size={14} className="mr-2" />
                Content
              </TabsTrigger>
              
              {hasFiles && (
                <TabsTrigger value="files" className="flex items-center">
                  <FileIcon size={14} className="mr-2" />
                  Files
                </TabsTrigger>
              )}
              
              {hasScreenshots && (
                <TabsTrigger value="screenshots" className="flex items-center">
                  <ImageIcon size={14} className="mr-2" />
                  Screenshots
                </TabsTrigger>
              )}
              
              {hasProjects && (
                <TabsTrigger value="submissions" className="flex items-center">
                  <PinIcon size={14} className="mr-2" />
                  Submissions
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* Content Tab - Main assignment content */}
            <TabsContent value="content" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpenIcon size={18} className="mr-2" />
                    Assignment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  {assignment.description && assignment.description.document ? (
                    <DocumentRenderer document={assignment.description.document} />
                  ) : (
                    <p className="text-muted-foreground">No detailed description available for this assignment.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Files Tab */}
            {hasFiles && (
              <TabsContent value="files" className="mt-0">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileIcon size={18} className="mr-2" />
                      Assignment Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {assignment.files!.map((file, index) => (
                      file.file && (
                        <div key={file.id || index} className="mb-6">
                          <UniversalFileViewer 
                            file={file.file}
                            title={file.title}
                            description={file.description}
                            fileType={file.fileType}
                          />
                        </div>
                      )
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {/* Screenshots Tab */}
            {hasScreenshots && (
              <TabsContent value="screenshots" className="mt-0">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon size={18} className="mr-2" />
                      Assignment Screenshots
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Main Screenshot Carousel */}
                    <div className="rounded-lg overflow-hidden border mb-4">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {assignment.screenshots!.map((screenshot, index) => (
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
                                        onClick={() => {
                                          if (screenshot.image?.url) {
                                            setSelectedScreenshot(getFullUrl(screenshot.image.url) || null);
                                          }
                                        }}
                                      >
                                        <ZoomInIcon size={16} />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh]">
                                      <div className="w-full h-full flex items-center justify-center">
                                        {selectedScreenshot && (
                                          <img 
                                            src={selectedScreenshot}
                                            alt={screenshot.caption || `Screenshot ${index + 1}`}
                                            style={{
                                              maxWidth: '100%',
                                              maxHeight: '100%',
                                              objectFit: 'contain'
                                            }}
                                          />
                                        )}
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
                      {assignment.screenshots!.map((screenshot, index) => (
                        screenshot.image && (
                          <div 
                            key={`thumb-${screenshot.id || index}`}
                            className="flex-shrink-0 w-24 h-16 border rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
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
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {/* Student Submissions Tab */}
            {hasProjects && (
              <TabsContent value="submissions" className="mt-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <GraduationCapIcon size={18} className="mr-2" />
                      Student Submissions
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {assignment.projects!.length} submission{assignment.projects!.length !== 1 ? 's' : ''}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {assignment.projects!.map((project) => {
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

                        return (
                          <Card key={project.id} className="hover:shadow-md transition-shadow overflow-hidden flex flex-col">
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
                                  <span className="text-muted-foreground">No preview available</span>
                                </div>
                              )}
                            </div>
                            
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{project.title}</CardTitle>
                            </CardHeader>
                            
                            <CardContent className="space-y-2 flex-grow">
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <UserIcon size={14} className="mr-1" />
                                <span>{project.student.name}</span>
                                {project.student.class && (
                                  <span className="ml-1">({project.student.class})</span>
                                )}
                              </div>
                              
                              {descriptionExcerpt && (
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {descriptionExcerpt}
                                </p>
                              )}
                            </CardContent>
                            
                            <CardFooter className="pt-0">
                              <Button asChild variant="outline" className="w-full">
                                <Link to={`/projects/${project.id}`}>
                                  <ChevronRightIcon size={16} className="mr-2" />
                                  View Project
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        {/* Sidebar content - right side takes 1/3 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Featured content box */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <ListTodoIcon size={18} className="mr-2" />
                Assignment Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* If we have a featured screenshot, show it */}
              {featuredScreenshot && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Preview</h3>
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
                      onClick={() => setActiveTab("screenshots")}
                    >
                      View all {assignment.screenshots!.length} screenshots
                    </Button>
                  )}
                </div>
              )}
              
              {/* If we have a featured file, add a preview card */}
              {featuredFile && featuredFile.file && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Primary Document</h3>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                    onClick={() => setActiveTab("files")}
                  >
                    <div className="flex items-center">
                      <FileIcon size={16} className="mr-2" />
                      <span className="truncate">
                        {featuredFile.title || featuredFile.file.filename}
                      </span>
                    </div>
                    <ChevronRightIcon size={16} />
                  </Button>
                </div>
              )}
              
              {/* Generic resource counts */}
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-medium">Resources</h3>
                <div className="grid grid-cols-2 gap-2">
                  {hasFiles && (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-start"
                      onClick={() => setActiveTab("files")}
                    >
                      <FileIcon size={16} className="mr-2" />
                      <span>{assignment.files!.length} File{assignment.files!.length !== 1 ? 's' : ''}</span>
                    </Button>
                  )}
                  
                  {hasScreenshots && (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-start"
                      onClick={() => setActiveTab("screenshots")}
                    >
                      <ImageIcon size={16} className="mr-2" />
                      <span>{assignment.screenshots!.length} Image{assignment.screenshots!.length !== 1 ? 's' : ''}</span>
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
                  Student Submissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Submissions</span>
                  <Badge variant="secondary">{assignment.projects!.length}</Badge>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => setActiveTab("submissions")}
                >
                  View All Submissions
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export { AssignmentDetailPage };