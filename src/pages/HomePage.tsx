// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { getProjects } from '@/lib/api';
import { ArrowRightIcon, BrainIcon, GemIcon, MessageCircleCodeIcon, PresentationIcon } from 'lucide-react';
import { Project } from '@/types/project';

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
          // Ensure all required fields are present - updated to check for students instead of student
          const validProjects = data.projects
            .filter((project: any) => 
              project && 
              ((project.students && project.students.length > 0) || project.student)
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
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 flex items-center justify-center">
        <BrainIcon size={32} className="mr-2" /><MessageCircleCodeIcon size={32} className="mr-2" /><GemIcon size={32} className="mr-2" />
          Code Podium
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Ontdek geweldige projecten gemaakt door leerlingen. Van games en apps
          tot websites en datavisualisaties.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/projects">Bekijk alle projecten</Link>
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