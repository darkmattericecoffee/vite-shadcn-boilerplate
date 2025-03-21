// src/components/assignment/assignment-content.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { BookOpenIcon } from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { CustomDocumentRenderer } from '@/components/ui/document-renderer';

interface AssignmentContentProps {
  assignment: Assignment;
}

export function AssignmentContent({ assignment }: AssignmentContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpenIcon size={18} className="mr-2" />
          Opdracht Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assignment.description && assignment.description.document ? (
          <div className="prose dark:prose-invert max-w-none text-left">
            <CustomDocumentRenderer document={assignment.description.document} />
          </div>
        ) : (
          <p className="text-muted-foreground">Geen gedetailleerde beschrijving beschikbaar voor deze opdracht.</p>
        )}
      </CardContent>
    </Card>
  );
}