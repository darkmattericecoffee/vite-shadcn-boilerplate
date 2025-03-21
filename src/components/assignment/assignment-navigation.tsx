// src/components/assignment/assignment-navigation.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  BookOpenIcon, 
  FileIcon,
  ImageIcon,
  PinIcon,
} from 'lucide-react';

interface AssignmentNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  hasFiles: boolean;
  hasScreenshots: boolean;
  hasProjects: boolean;
}

export function AssignmentNavigation({ 
  activeSection, 
  onSectionChange,
  hasFiles,
  hasScreenshots,
  hasProjects
}: AssignmentNavigationProps) {
  return (
    <div className="flex overflow-x-auto space-x-2 border-b pb-2">
      <NavigationButton 
        id="content"
        isActive={activeSection === "content"}
        onClick={() => onSectionChange("content")}
        icon={<BookOpenIcon size={16} />}
        label="Inhoud"
      />
      
      {hasFiles && (
        <NavigationButton 
          id="files"
          isActive={activeSection === "files"}
          onClick={() => onSectionChange("files")}
          icon={<FileIcon size={16} />}
          label="Bestanden"
        />
      )}
      
      {hasScreenshots && (
        <NavigationButton 
          id="screenshots"
          isActive={activeSection === "screenshots"}
          onClick={() => onSectionChange("screenshots")}
          icon={<ImageIcon size={16} />}
          label="Screenshots"
        />
      )}
      
      {hasProjects && (
        <NavigationButton 
          id="submissions"
          isActive={activeSection === "submissions"}
          onClick={() => onSectionChange("submissions")}
          icon={<PinIcon size={16} />}
          label="Inzendingen"
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
  label 
}: NavigationButtonProps) {
  return (
    <button
      id={`nav-${id}`}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted"
      )}
    >
      {icon}
      {label}
    </button>
  );
}