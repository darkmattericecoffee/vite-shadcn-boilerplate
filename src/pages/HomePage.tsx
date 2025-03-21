// src/pages/HomePage.tsx - Fixed Project interface
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { getProjects } from '@/lib/api';
import { ArrowRightIcon } from 'lucide-react';

// Import the Project type from your types file if you have one
// If not, make sure this matches exactly with the Project type expected by ProjectCard
interface Project {
  id: string;
  title: string;
  student: {
    id: string; // Added missing id field
    name: string;
    class?: string;
  };
  assignment: {
    id: string; // Added missing id field
    title: string;
  };
  languages: {
    id: string; // Added missing id field
    name: string;
  }[];
  projectType: string;
  screenshots?: {
    id: string;
    caption: string;
    image: {
      url: string;
      width?: number;
      height?: number;
      filesize?: number;
    };
  }[];
  createdAt: string;
}

export const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        
        // We need to explicitly pass featured: true to the API
        const data = await getProjects({ featured: true });
        
        if (data && data.projects) {
          // Ensure all required fields are present
          const validProjects = data.projects
            .filter((project: any) => 
              project && 
              project.student && 
              project.student.id && 
              project.assignment && 
              project.assignment.id
            )
            .slice(0, 6); // Limit to 6 projects for the homepage
            
          setFeaturedProjects(validProjects);
        } else {
          console.error('Invalid data structure from getProjects');
          setFeaturedProjects([]);
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        setFeaturedProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Informatica Showcase
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Ontdek geweldige projecten gemaakt door IT-studenten. Van games en apps
          tot websites en datavisualisaties.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/projects">Browse All Projects</Link>
          </Button>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Uitgelichte Projecten</h2>
          <Button variant="ghost" asChild>
        <Link to="/projects" className="flex items-center">
          Bekijk alle <ArrowRightIcon size={16} className="ml-1" />
        </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-muted animate-pulse h-64 rounded-lg"></div>
        ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Nog geen uitgelichte projecten.</p>
          </div>
        )}
      </section>
    </div>
  );
};