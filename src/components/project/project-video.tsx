// src/components/project/project-video.tsx
import React, { useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { VideoIcon } from 'lucide-react';

interface ProjectVideoProps {
  embedCode: string;
  title?: string;
}

export function ProjectVideo({ embedCode, title = "Video" }: ProjectVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Function to make the iframe responsive
    const makeResponsive = () => {
      if (!containerRef.current) return;
      
      // Parse the embed code to extract the iframe
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = embedCode;
      const iframe = tempDiv.querySelector('iframe');
      
      if (iframe) {
        // Remove fixed width and height
        iframe.removeAttribute('width');
        iframe.removeAttribute('height');
        
        // Add responsive classes
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.border = '0';
        
        // Update the container with the modified iframe HTML
        if (containerRef.current) {
          containerRef.current.innerHTML = iframe.outerHTML;
        }
      }
    };
    
    if (embedCode) {
      makeResponsive();
    }
  }, [embedCode]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <VideoIcon size={18} className="mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md overflow-hidden bg-black">
          {embedCode ? (
            <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
              <div 
                ref={containerRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video w-full flex items-center justify-center">
              <p className="text-muted-foreground">Geen video beschikbaar</p>
            </div>
          )}
        </div>
        {embedCode && (
          <p className="text-sm text-muted-foreground mt-3">
            Deze video is ingesloten van een externe bron en toont een demo of uitleg van het project.
          </p>
        )}
      </CardContent>
    </Card>
  );
}