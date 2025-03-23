// src/components/projects/ProjectGrid.tsx
import React from 'react';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  onClearFilters?: () => void;
  onRetry?: () => void;
}

export function ProjectGrid({ projects, isLoading, error, onClearFilters, onRetry }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-muted animate-pulse h-64 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">{error}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="mt-4"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No projects found matching your filters.</p>
        {onClearFilters && (
          <Button
            onClick={onClearFilters}
            className="mt-4"
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}