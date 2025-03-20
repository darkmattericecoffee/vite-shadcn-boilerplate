// src/components/project/project-files.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { FileIcon } from 'lucide-react';
import { UniversalFileViewer } from '@/components/viewer/universal-file-viewer';
import { Project } from '@/types/project';

interface ProjectFilesProps {
  files: Project['files'];
}

export function ProjectFiles({ files }: ProjectFilesProps) {
  if (!files || files.length === 0) return null;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileIcon size={18} className="mr-2" />
          Project Files
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