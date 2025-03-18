// src/pages/ProjectDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProjectDetail from '@/components/projects/ProjectDetail';
import { getProjectById } from '@/lib/api';
import { ArrowLeftIcon } from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError('');
        if (!id) {
          throw new Error('Project ID is undefined');
        }
        const data = await getProjectById(id);
        setProject(data.project);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project. It may have been deleted or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-2/3"></div>
        <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
        <div className="h-64 bg-muted animate-pulse rounded mt-8"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || 'This project does not exist.'}</p>
        <Button asChild>
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/projects" className="flex items-center">
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>
      
      <ProjectDetail project={project} />
    </div>
  );
};