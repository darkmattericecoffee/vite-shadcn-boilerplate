// src/components/project/project-navigation.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import {
  BookOpenIcon,
  FileIcon,
  ImageIcon,
  LinkIcon,
  ActivityIcon,
  VideoIcon,
} from 'lucide-react';

interface ProjectNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  hasInteractive?: boolean;
  hasFiles: boolean;
  hasScreenshots: boolean;
  hasLink: boolean;
  hasVideo?: boolean;
}

export function ProjectNavigation({
  activeSection,
  onSectionChange,
  hasInteractive = false,
  hasFiles,
  hasScreenshots,
  hasLink,
  hasVideo = false,
}: ProjectNavigationProps) {
  return (
    <div className="sticky top-[79px] z-20 bg-background/95 backdrop-blur-sm border-b py-2">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {hasInteractive && (
            <NavigationButton
              id="interactive"
              isActive={activeSection === 'interactive'}
              onClick={() => onSectionChange('interactive')}
              icon={<ActivityIcon size={16} />}
              label="Interactief"
            />
          )}
          {hasVideo && (
            <NavigationButton
              id="video"
              isActive={activeSection === 'video'}
              onClick={() => onSectionChange('video')}
              icon={<VideoIcon size={16} />}
              label="Video"
            />
          )}
          <NavigationButton
            id="content"
            isActive={activeSection === 'content'}
            onClick={() => onSectionChange('content')}
            icon={<BookOpenIcon size={16} />}
            label="Inhoud"
          />
          {hasFiles && (
            <NavigationButton
              id="files"
              isActive={activeSection === 'files'}
              onClick={() => onSectionChange('files')}
              icon={<FileIcon size={16} />}
              label="Bestanden"
            />
          )}
          {hasScreenshots && (
            <NavigationButton
              id="screenshots"
              isActive={activeSection === 'screenshots'}
              onClick={() => onSectionChange('screenshots')}
              icon={<ImageIcon size={16} />}
              label="Screenshots"
            />
          )}
          {hasLink && (
            <NavigationButton
              id="link"
              isActive={activeSection === 'link'}
              onClick={() => onSectionChange('link')}
              icon={<LinkIcon size={16} />}
              label="Live Link"
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
        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      )}
    >
      {icon}
      {label}
    </button>
  );
}