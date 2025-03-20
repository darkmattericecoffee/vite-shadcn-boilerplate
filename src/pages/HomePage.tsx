// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { getProjects } from '@/lib/api';
import { ArrowRightIcon } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  student: {
    name: string;
    class?: string;
  };
  assignment: {
    title: string;
  };
  languages: {
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
        const data = await getProjects({ featured: true });
        setFeaturedProjects(data.projects.slice(0, 6)); // Limit to 6 projects for the homepage
      } catch (error) {
        console.error('Error fetching featured projects:', error);
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
          Student Project Showcase
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover amazing projects created by IT students. From games and apps
          to websites and data visualizations.
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
          <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
          <Button variant="ghost" asChild>
            <Link to="/projects" className="flex items-center">
              View all <ArrowRightIcon size={16} className="ml-1" />
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
                id={project.id}
                title={project.title}
                student={project.student}
                assignment={project.assignment}
                languages={project.languages}
                projectType={project.projectType}
                // The issue is fixed: screenshots have image.url, not url directly
                thumbnailUrl={project.screenshots && project.screenshots.length > 0 && project.screenshots[0].image ? project.screenshots[0].image.url : undefined}
                createdAt={project.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No featured projects yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};