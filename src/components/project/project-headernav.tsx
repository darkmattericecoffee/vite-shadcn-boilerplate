// src/components/project/project-header-with-nav.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { ProjectHeader } from './project-header';
import { ProjectNavigation } from './project-navigation';
import { Project } from '@/types/project';

interface ProjectHeaderWithNavProps {
  project: Project;
  activeSection: string;
  onSectionChange: (section: string) => void;
  hasInteractive?: boolean;
  hasFiles?: boolean;
  hasCodeFiles?: boolean;
  hasScreenshots?: boolean;
  hasLink?: boolean;
  hasVideo?: boolean;
}

export function ProjectHeaderWithNav({
  project,
  activeSection,
  onSectionChange,
  hasInteractive = false,
  hasFiles = false,
  hasCodeFiles = false,
  hasScreenshots = false,
  hasLink = false,
  hasVideo = false
}: ProjectHeaderWithNavProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Track scroll position to add background and border when scrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Check if the project has a cover image
  const hasCoverImage = project.screenshots && 
    project.screenshots.length > 0 && 
    project.screenshots[0].image;
  
  return (
    <div className="sticky top-0 z-50 bg-background">
      {/* Back button - always visible */}
      <div className="pt-2 pb-2 px-4">
        <Button variant="outline" size="sm" asChild className="mb-2">
          <Link to="/projects" className="flex items-center">
            <ArrowLeftIcon size={16} className="mr-2" />
            Terug naar projecten
          </Link>
        </Button>
      </div>
      
      {/* Project header */}
      <div className="bg-background">
        <ProjectHeader project={project} />
      </div>
      
      {/* Navigation - positioned correctly relative to header */}
      <div className="sticky top-0 z-20">
        <ProjectNavigation
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          hasInteractive={hasInteractive}
          hasFiles={hasFiles}
          hasCodeFiles={hasCodeFiles}
          hasScreenshots={hasScreenshots}
          hasLink={hasLink}
          hasVideo={hasVideo}
        />
      </div>
    </div>
  );
}