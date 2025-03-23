// src/components/projects/ProjectList.tsx
import React from 'react';
import { ProjectCard } from './ProjectCard.js';
import { ProjectFilters } from './ProjectFilters.js';

// Import the Project type from your types file instead of redefining it
import { Project } from '../../types/project';

type ProjectListProps = {
  projects: Project[];
  loading: boolean;
};

const ProjectList: React.FC<ProjectListProps> = ({ projects, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-muted animate-pulse h-64 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Geen projecten gevonden</h3>
        <p className="text-muted-foreground mt-1">
          Probeer je filters aan te passen of kom later terug voor nieuwe projecten.
        </p>
      </div>
    );
  }

  // Detailed project data logging for debugging
  console.log("Full Projects data:", JSON.stringify(projects, null, 2));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        console.log(`Project ${project.title} data:`, project);
        
        return (
          <ProjectCard
            key={project.id}
            project={project}
          />
        );
      })}
    </div>
  );
};

export { ProjectCard, ProjectFilters, ProjectList };