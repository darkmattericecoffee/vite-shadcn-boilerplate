// src/pages/ProjectDetailPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MaximizeIcon, ExternalLinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getProjectById, getFullUrl } from '@/lib/api';

// Import project components
import { ProjectHeaderWithNav } from '@/components/project/project-headernav';
import { ProjectContent } from '@/components/project/project-content';
import { ProjectFiles } from '@/components/project/project-files';
import { ProjectScreenshots } from '@/components/project/project-screenshots';
import { ProjectLink } from '@/components/project/project-link';
import { ProjectSidebar } from '@/components/project/project-sidebar';
import { ProjectVideo } from '@/components/project/project-video';
import { ProjectCodeFiles } from '@/components/project/project-code-files';

// Import the Project type
import { Project } from '@/types/project';

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('content');

  // References for scroll-to-section functionality
  const interactiveRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
  const codeFilesRef = useRef<HTMLDivElement>(null);
  const screenshotsRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);

  // Determine if interactive content is available from zipArchives
  const hasInteractiveContent =
    project?.zipArchives &&
    project.zipArchives.length > 0 &&
    project.zipArchives.some((za) => za.extractedPath);

  const getInteractiveContent = () => {
    if (!project?.zipArchives) return null;
    // Prefer an extracted path that ends with .html
    const htmlArchive = project.zipArchives.find(
      (za) =>
        za.extractedPath &&
        za.extractedPath.toLowerCase().endsWith('.html')
    );
    if (htmlArchive) return htmlArchive.extractedPath;
    return project.zipArchives.find((za) => za.extractedPath)?.extractedPath || null;
  };

  const interactiveContentUrl = getInteractiveContent();

  // Set up an IntersectionObserver for the section spy functionality
  useEffect(() => {
    if (!project) return;

    const hasFiles = Boolean(project.files && project.files.length > 0);
    const hasCodeFiles = Boolean(project.codeFiles && project.codeFiles.length > 0);
    const hasScreenshots = Boolean(project.screenshots && project.screenshots.length > 0);
    const hasLink = Boolean(project.link);
    const hasInteractive = Boolean(hasInteractiveContent);
    const hasVideo = Boolean(project.embedCode);

    // Adjust rootMargin to account for the sticky header height
    const headerHeight = document.querySelector('.sticky-header')?.clientHeight || 0;
    const rootMargin = `-${headerHeight + 20}px 0px -70% 0px`;

    const observerOptions = {
      root: null,
      rootMargin,
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    if (hasInteractive && interactiveRef.current) observer.observe(interactiveRef.current);
    if (hasVideo && videoRef.current) observer.observe(videoRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    if (hasFiles && filesRef.current) observer.observe(filesRef.current);
    if (hasCodeFiles && codeFilesRef.current) observer.observe(codeFilesRef.current);
    if (hasScreenshots && screenshotsRef.current) observer.observe(screenshotsRef.current);
    if (hasLink && linkRef.current) observer.observe(linkRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [project, hasInteractiveContent]);

  // Fetch project data by ID
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) throw new Error('Project ID is undefined');
        const data = await getProjectById(id);
        setProject(data.project);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(
          'Failed to load project. It may have been deleted or you may not have permission to view it.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    } else {
      setError('Project ID is missing');
      setLoading(false);
    }
  }, [id]);

  // Scroll to a specific section when a navigation button is clicked
  const scrollToSection = (section: string) => {
    setActiveSection(section);

    let ref = null;
    switch (section) {
      case 'interactive':
        ref = interactiveRef;
        break;
      case 'video':
        ref = videoRef;
        break;
      case 'content':
        ref = contentRef;
        break;
      case 'files':
        ref = filesRef;
        break;
      case 'codeFiles':
        ref = codeFilesRef;
        break;
      case 'screenshots':
        ref = screenshotsRef;
        break;
      case 'link':
        ref = linkRef;
        break;
    }

    if (ref && ref.current) {
      // Add offset for the sticky header
      const headerHeight = document.querySelector('.sticky-header')?.clientHeight || 0;
      const yOffset = -headerHeight - 20; // Additional 20px buffer
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 bg-muted animate-pulse rounded mb-6"></div>
        <div className="h-24 bg-muted animate-pulse rounded"></div>
        <div className="h-64 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">{error || 'This project does not exist.'}</p>
        <Button asChild className="mt-4">
          <Link to="/projects">Terug naar projecten</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Combined header and navigation with sticky positioning */}
      <ProjectHeaderWithNav
        project={project}
        activeSection={activeSection}
        onSectionChange={scrollToSection}
        hasInteractive={Boolean(hasInteractiveContent)}
        hasFiles={Boolean(project.files && project.files.length > 0)}
        hasCodeFiles={Boolean(project.codeFiles && project.codeFiles.length > 0)}
        hasScreenshots={Boolean(project.screenshots && project.screenshots.length > 0)}
        hasLink={Boolean(project.link)}
        hasVideo={Boolean(project.embedCode)}
      />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* Left side: main content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive content section */}
          {/* Content section */}
          <div id="content" ref={contentRef} className="scroll-mt-48">
            <ProjectContent project={project} />
          </div>
          {hasInteractiveContent && (
            <div id="interactive" ref={interactiveRef} className="scroll-mt-48">
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
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">Geen interactieve inhoud beschikbaar</span>
                    </div>
                  )}
                </div>
                {interactiveContentUrl && (
                  <div className="flex justify-between items-center p-2 bg-muted/30">
                    <span className="text-sm font-medium">Interactieve Demo</span>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
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
                                display: 'block',
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
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <ExternalLinkIcon size={14} />
                          <span>Open Tab</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video section */}
          {project.embedCode && (
            <div id="video" ref={videoRef} className="scroll-mt-48">
              <ProjectVideo embedCode={project.embedCode} title="Video" />
            </div>
          )}

          

          {/* Files section */}
          {project.files && project.files.length > 0 && (
            <div id="files" ref={filesRef} className="scroll-mt-48">
              <ProjectFiles files={project.files} />
            </div>
          )}

          {/* Code Files section */}
          {project.codeFiles && project.codeFiles.length > 0 && (
            <div id="codeFiles" ref={codeFilesRef} className="scroll-mt-48">
              <ProjectCodeFiles codeFiles={project.codeFiles} />
            </div>
          )}

          {/* Screenshots section */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div id="screenshots" ref={screenshotsRef} className="scroll-mt-48">
              <ProjectScreenshots screenshots={project.screenshots} />
            </div>
          )}

          {/* Live link section */}
          {project.link && (
            <div id="link" ref={linkRef} className="scroll-mt-48">
              <ProjectLink link={project.link} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-60 space-y-6 pt-2">
            <ProjectSidebar project={project} onSectionChange={scrollToSection} />
          </div>
        </div>
      </div>
    </div>
  );
};