// src/components/project/project-content.tsx
import React from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { BookOpenIcon } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectContentProps {
  project: Project;
}

export function ProjectContent({ project }: ProjectContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpenIcon size={18} className="mr-2" />
          Project Description
        </CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        {project.description && project.description.document ? (
          <DocumentRenderer document={project.description.document} />
        ) : (
          <p className="text-muted-foreground">No detailed description available for this project.</p>
        )}
      </CardContent>
    </Card>
  );
}