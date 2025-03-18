// src/components/projects/ProjectList.tsx
import React from 'react';
import { ProjectCard } from './ProjectCard.js';
import { ProjectFilters } from './ProjectFilters.js';

type Project = {
  id: string;
  title: string;
  student: {
    name: string;
    class?: string;
  };
  assignment?: {
    title: string;
  };
  languages: Array<{
    name: string;
  }>;
  projectType: string;
  screenshots?: Array<{
    image?: {
      url: string;
      width?: number;
      height?: number;
      filesize?: number;
    };
    caption?: string;
  }>;
  createdAt: string;
};

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
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or check back later for new projects.
        </p>
      </div>
    );
  }

  // Detailed project data logging for debugging
  console.log("Full Projects data:", JSON.stringify(projects, null, 2));
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        // Get thumbnail from first screenshot's image, if available
        let thumbnailUrl: string | undefined = undefined;
        
        if (project.screenshots && project.screenshots.length > 0 && project.screenshots[0].image) {
          thumbnailUrl = project.screenshots[0].image.url;
        }
        
        console.log(`Project ${project.title} thumbnailUrl:`, thumbnailUrl);
          
        return (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            student={project.student}
            assignment={project.assignment}
            languages={project.languages}
            projectType={project.projectType}
            thumbnailUrl={thumbnailUrl}
            createdAt={project.createdAt}
          />
        );
      })}
    </div>
  );
};

export { ProjectCard, ProjectFilters, ProjectList };