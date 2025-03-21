// src/components/project/project-link.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LinkIcon, ExternalLinkIcon } from 'lucide-react';


interface ProjectLinkProps {
  link?: string | null;
}

export function ProjectLink({ link }: ProjectLinkProps) {
  if (!link) return null;

  // Format the URL for display
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch (e) {
      return url;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LinkIcon size={18} className="mr-2" />
          Live Project Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Dit project is online beschikbaar. Klik op de knop hieronder om het live project te bekijken.
        </p>
        <div className="bg-muted p-3 rounded-md mb-4 truncate">
          <code className="text-sm">{formatUrl(link)}</code>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center"
          >
            <span>Bezoek Live Project</span>
            <ExternalLinkIcon size={16} className="ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}