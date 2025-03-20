// src/components/project/project-navigation.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import {
  BookOpenIcon,
  FileIcon,
  ImageIcon,
  LinkIcon,
  ActivityIcon,
} from 'lucide-react';

interface ProjectNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  hasInteractive?: boolean;
  hasFiles: boolean;
  hasScreenshots: boolean;
  hasLink: boolean;
}

export function ProjectNavigation({
  activeSection,
  onSectionChange,
  hasInteractive = false,
  hasFiles,
  hasScreenshots,
  hasLink,
}: ProjectNavigationProps) {
  return (
    <div className="flex overflow-x-auto space-x-2 border-b pb-2">
      {hasInteractive && (
        <NavigationButton
          id="interactive"
          isActive={activeSection === 'interactive'}
          onClick={() => onSectionChange('interactive')}
          icon={<ActivityIcon size={16} />}
          label="Interactive"
        />
      )}
      <NavigationButton
        id="content"
        isActive={activeSection === 'content'}
        onClick={() => onSectionChange('content')}
        icon={<BookOpenIcon size={16} />}
        label="Content"
      />
      {hasFiles && (
        <NavigationButton
          id="files"
          isActive={activeSection === 'files'}
          onClick={() => onSectionChange('files')}
          icon={<FileIcon size={16} />}
          label="Files"
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