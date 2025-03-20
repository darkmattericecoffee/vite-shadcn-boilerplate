// src/components/assignment/assignment-content.tsx
import React from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { BookOpenIcon } from 'lucide-react';
import { Assignment } from '@/types/assignment';

interface AssignmentContentProps {
  assignment: Assignment;
}

export function AssignmentContent({ assignment }: AssignmentContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpenIcon size={18} className="mr-2" />
          Assignment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        {assignment.description && assignment.description.document ? (
          <DocumentRenderer document={assignment.description.document} />
        ) : (
          <p className="text-muted-foreground">No detailed description available for this assignment.</p>
        )}
      </CardContent>
    </Card>
  );
}