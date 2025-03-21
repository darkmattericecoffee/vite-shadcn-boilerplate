// src/components/project/project-content.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { BookOpenIcon } from 'lucide-react';
import { Project } from '@/types/project';
import { CustomDocumentRenderer } from '@/components/ui/document-renderer';

interface ProjectContentProps {
  project: Project;
}

export function ProjectContent({ project }: ProjectContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpenIcon size={18} className="mr-2" />
          Projectbeschrijving
        </CardTitle>
      </CardHeader>
      <CardContent>
        {project.description && project.description.document ? (
          <div className="prose dark:prose-invert max-w-none text-left">
            <CustomDocumentRenderer document={project.description.document} />
          </div>
        ) : (
          <p className="text-muted-foreground">Geen gedetailleerde beschrijving beschikbaar voor dit project.</p>
        )}
      </CardContent>
    </Card>
  );
}