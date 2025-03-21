// src/pages/ProjectDetailPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, MaximizeIcon, ExternalLinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getProjectById, getFullUrl } from '@/lib/api';

// Import refactored project components
import { ProjectHeader } from '@/components/project/project-header';
import { ProjectNavigation } from '@/components/project/project-navigation';
import { ProjectContent } from '@/components/project/project-content';
import { ProjectFiles } from '@/components/project/project-files';
import { ProjectScreenshots } from '@/components/project/project-screenshots';
import { ProjectLink } from '@/components/project/project-link';
import { ProjectSidebar } from '@/components/project/project-sidebar';

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
  const contentRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
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
    const hasScreenshots = Boolean(project.screenshots && project.screenshots.length > 0);
    const hasLink = Boolean(project.link);
    const hasInteractive = Boolean(hasInteractiveContent);

    const observerOptions = {
      root: null,
      rootMargin: '-32px 0px -70% 0px', // Adjust for sticky header height
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
    if (contentRef.current) observer.observe(contentRef.current);
    if (hasFiles && filesRef.current) observer.observe(filesRef.current);
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
      case 'content':
        ref = contentRef;
        break;
      case 'files':
        ref = filesRef;
        break;
      case 'screenshots':
        ref = screenshotsRef;
        break;
      case 'link':
        ref = linkRef;
        break;
    }

    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      {/* Hero section with sticky header and back button */}
      <div className="sticky top-0 z-20 pt-2 bg-background pb-2 border-b">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link to="/projects" className="flex items-center">
            <ArrowLeftIcon size={16} className="mr-2" />
            Terug naar projecten
          </Link>
        </Button>
        <ProjectHeader project={project} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* Left side: main content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation bar including interactive section when available */}
          <div className="sticky top-24 z-10 bg-background pt-2 pb-2">
            <ProjectNavigation
              activeSection={activeSection}
              onSectionChange={scrollToSection}
              hasInteractive={Boolean(hasInteractiveContent)}
              hasFiles={Boolean(project.files && project.files.length > 0)}
              hasScreenshots={Boolean(project.screenshots && project.screenshots.length > 0)}
              hasLink={Boolean(project.link)}
            />
          </div>

          {/* Interactive content section */}
          {hasInteractiveContent && (
            <div id="interactive" ref={interactiveRef} className="scroll-mt-32">
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
                          <span>Nieuwe tab</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content section */}
          <div id="content" ref={contentRef} className="scroll-mt-32">
            <ProjectContent project={project} />
          </div>

          {/* Files section */}
          {project.files && project.files.length > 0 && (
            <div id="files" ref={filesRef} className="scroll-mt-32">
              <ProjectFiles files={project.files} />
            </div>
          )}

          {/* Screenshots section */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div id="screenshots" ref={screenshotsRef} className="scroll-mt-32">
              <ProjectScreenshots screenshots={project.screenshots} />
            </div>
          )}

          {/* Live link section */}
          {project.link && (
            <div id="link" ref={linkRef} className="scroll-mt-32">
              <ProjectLink link={project.link} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6 pt-2">
            <ProjectSidebar project={project} onSectionChange={scrollToSection} />
          </div>
        </div>
      </div>
    </div>
  );
};