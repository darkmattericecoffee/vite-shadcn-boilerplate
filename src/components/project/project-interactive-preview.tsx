// src/components/project/project-interactive-preview.tsx
import React from 'react';

interface ProjectInteractivePreviewProps {
  previewUrl: string;
}

export function ProjectInteractivePreview({ previewUrl }: ProjectInteractivePreviewProps) {
  return (
    <div className="w-full h-[500px] border rounded-md overflow-hidden">
      <iframe 
         src={previewUrl} 
         title="Interactive Preview"
         className="w-full h-full"
         frameBorder="0"
         allowFullScreen
      />
    </div>
  );
}