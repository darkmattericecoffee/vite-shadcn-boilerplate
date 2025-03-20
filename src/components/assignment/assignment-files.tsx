// src/components/assignment/assignment-files.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { FileIcon } from 'lucide-react';
import { UniversalFileViewer } from '@/components/viewer/universal-file-viewer';
import { Assignment } from '@/types/assignment';

interface AssignmentFilesProps {
  files: Assignment['files'];
}

export function AssignmentFiles({ files }: AssignmentFilesProps) {
  if (!files || files.length === 0) return null;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileIcon size={18} className="mr-2" />
          Assignment Materials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {files.map((file, index) => (
          file.file && (
            <div key={file.id || index} className="mb-6">
              <UniversalFileViewer 
                file={file.file}
                title={file.title}
                description={file.description}
                fileType={file.fileType}
              />
            </div>
          )
        ))}
      </CardContent>
    </Card>
  );
}