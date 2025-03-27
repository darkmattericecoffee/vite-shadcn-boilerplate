// src/components/project/project-navigation.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import {
  BookOpenIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  LinkIcon,
  PlayIcon,
  VideoIcon,
} from 'lucide-react';

interface ProjectNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  hasInteractive?: boolean;
  hasFiles?: boolean;
  hasCodeFiles?: boolean;
  hasScreenshots?: boolean;
  hasLink?: boolean;
  hasVideo?: boolean;
}

export function ProjectNavigation({
  activeSection,
  onSectionChange,
  hasInteractive = false,
  hasFiles = false,
  hasCodeFiles = false,
  hasScreenshots = false,
  hasLink = false,
  hasVideo = false,
}: ProjectNavigationProps) {
  return (
    <div className="bg-background/95 backdrop-blur-sm border-b py-2">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex overflow-x-auto space-x-2 pb-2 px-4">
          {/* Content tab is always present */}
          <NavigationButton
            id="content"
            isActive={activeSection === 'content'}
            onClick={() => onSectionChange('content')}
            icon={<FileTextIcon size={16} />}
            label="Beschrijving"
          />

          {/* Interactive content tab (if available) */}
          {hasInteractive && (
            <NavigationButton
              id="interactive"
              isActive={activeSection === 'interactive'}
              onClick={() => onSectionChange('interactive')}
              icon={<PlayIcon size={16} />}
              label="Interactive"
            />
          )}

          {/* Video tab (if available) */}
          {hasVideo && (
            <NavigationButton
              id="video"
              isActive={activeSection === 'video'}
              onClick={() => onSectionChange('video')}
              icon={<VideoIcon size={16} />}
              label="Video"
            />
          )}

          {/* Files tab (if available) */}
          {hasFiles && (
            <NavigationButton
              id="files"
              isActive={activeSection === 'files'}
              onClick={() => onSectionChange('files')}
              icon={<FileIcon size={16} />}
              label="Files"
            />
          )}
          
          {/* Code Files tab (if available) */}
          {hasCodeFiles && (
            <NavigationButton
              id="codeFiles"
              isActive={activeSection === 'codeFiles'}
              onClick={() => onSectionChange('codeFiles')}
              icon={<FileTextIcon size={16} />}
              label="Documenten"
            />
          )}

          {/* Screenshots tab (if available) */}
          {hasScreenshots && (
            <NavigationButton
              id="screenshots"
              isActive={activeSection === 'screenshots'}
              onClick={() => onSectionChange('screenshots')}
              icon={<ImageIcon size={16} />}
              label="Afbeeldingen"
            />
          )}

          {/* Link tab (if available) */}
          {hasLink && (
            <NavigationButton
              id="link"
              isActive={activeSection === 'link'}
              onClick={() => onSectionChange('link')}
              icon={<LinkIcon size={16} />}
              label="Live Project"
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface NavigationButtonProps {
  id: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function NavigationButton({
  id,
  isActive,
  onClick,
  icon,
  label,
}: NavigationButtonProps) {
  return (
    <button
      id={`nav-${id}`}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      )}
    >
      {icon}
      {label}
    </button>
  );
}