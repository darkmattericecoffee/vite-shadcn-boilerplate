// src/pages/AssignmentDetailPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getAssignmentById } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

// Import our components
import { AssignmentHeader } from '@/components/assignment/assignment-header';
import { AssignmentNavigation } from '@/components/assignment/assignment-navigation';
import { AssignmentContent } from '@/components/assignment/assignment-content';
import { AssignmentFiles } from '@/components/assignment/assignment-files';
import { AssignmentScreenshots } from '@/components/assignment/assignment-screenshots';
import { AssignmentSubmissions } from '@/components/assignment/assignment-submissions';
import { AssignmentSidebar } from '@/components/assignment/assignment-sidebar';

// Import the types
import { Assignment } from '@/types/assignment';

const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("content");
  
  // Check if we're coming from a learning path
  const isFromLearningPath = location.state?.from === 'learning-path' || 
                            location.pathname.includes('/learning-paths/');
  
  // Stel de terug-link en tekst in op basis van waar we vandaan kwamen
  const backLink = isFromLearningPath 
    ? "/learning-paths"  // Ga naar de lijst van leerpaden, niet een specifiek pad
    : "/assignments";
  
  const backText = isFromLearningPath
    ? "Terug naar Leerpaden"  // Meervoud, ga naar de lijstpagina
    : "Terug naar Opdrachten";

  // Determine learning path ID from the URL if it exists
  const learningPathIdMatch = location.pathname.match(/\/learning-paths\/([^/]+)\/assignments/);
  const learningPathId = learningPathIdMatch ? learningPathIdMatch[1] : undefined;

  // References to scroll to sections
  const contentRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
  const screenshotsRef = useRef<HTMLDivElement>(null);
  const submissionsRef = useRef<HTMLDivElement>(null);

  // Observer for spy functionality
  useEffect(() => {
    if (!assignment) return;

    const hasFiles = Boolean(assignment.files && assignment.files.length > 0);
    const hasScreenshots = Boolean(assignment.screenshots && assignment.screenshots.length > 0);
    const hasProjects = Boolean(assignment.projects && assignment.projects.length > 0);

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -70% 0px', // Adjusted for sticky header
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all available sections
    if (contentRef.current) observer.observe(contentRef.current);
    if (hasFiles && filesRef.current) observer.observe(filesRef.current);
    if (hasScreenshots && screenshotsRef.current) observer.observe(screenshotsRef.current);
    if (hasProjects && submissionsRef.current) observer.observe(submissionsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [assignment]);

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

  // Scroll to section handler
  const scrollToSection = (section: string) => {
    setActiveSection(section);
    
    let ref = null;
    switch (section) {
      case 'content':
        ref = contentRef;
        break;
      case 'files':
        ref = filesRef;
        break;
      case 'screenshots':
        ref = screenshotsRef;
        break;
      case 'submissions':
        ref = submissionsRef;
        break;
    }

    if (ref && ref.current) {
      // Scroll with smooth behavior
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
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

  const hasFiles = Boolean(assignment.files && assignment.files.length > 0);
  const hasScreenshots = Boolean(assignment.screenshots && assignment.screenshots.length > 0);
  const hasProjects = Boolean(assignment.projects && assignment.projects.length > 0);
  
  // Check if the assignment has a cover image to adjust navigation positioning
  const hasCoverImage = assignment.screenshots && 
    assignment.screenshots.length > 0 && 
    assignment.screenshots[0].image;

  return (
    <div className="space-y-6">
      {/* Back button - now part of main page, outside the header */}
      <div className="pt-2 pb-2">
        <Button 
          variant="outline" 
          size="sm" 
          asChild
        >
          <Link to={backLink} className="flex items-center">
            <ArrowLeftIcon size={16} className="mr-2" />
            {backText}
          </Link>
        </Button>
      </div>
      
      {/* Header - handles its own stickiness */}
      <AssignmentHeader assignment={assignment} learningPathId={learningPathId} />
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Media content - left side takes 2/3 */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sticky navigation - adjust top position based on whether there's a cover image */}
          <div className={`sticky z-10 bg-background pt-2 pb-2 ${hasCoverImage ? 'top-20' : 'top-16'}`}>
            <AssignmentNavigation 
              activeSection={activeSection} 
              onSectionChange={scrollToSection}
              hasFiles={hasFiles}
              hasScreenshots={hasScreenshots}
              hasProjects={hasProjects}
            />
          </div>

          {/* Content sections - adjust scroll margin based on navigation position */}
          <div id="content" ref={contentRef} className={`${hasCoverImage ? 'scroll-mt-28' : 'scroll-mt-24'}`}>
            <AssignmentContent assignment={assignment} />
          </div>
          
          {hasFiles && (
            <div id="files" ref={filesRef} className={`${hasCoverImage ? 'scroll-mt-28' : 'scroll-mt-24'}`}>
              <AssignmentFiles files={assignment.files} />
            </div>
          )}
          
          {hasScreenshots && (
            <div id="screenshots" ref={screenshotsRef} className={`${hasCoverImage ? 'scroll-mt-28' : 'scroll-mt-24'}`}>
              <AssignmentScreenshots screenshots={assignment.screenshots} />
            </div>
          )}
          
          {hasProjects && (
            <div id="submissions" ref={submissionsRef} className={`${hasCoverImage ? 'scroll-mt-28' : 'scroll-mt-24'}`}>
              <AssignmentSubmissions projects={assignment.projects} />
            </div>
          )}
        </div>
        
        {/* Sidebar content - right side takes 1/3 */}
        <div className="lg:col-span-4">
          <div className={`sticky space-y-6 ${hasCoverImage ? 'top-28' : 'top-24'}`}>
            <AssignmentSidebar 
              assignment={assignment} 
              onSectionChange={scrollToSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { AssignmentDetailPage };