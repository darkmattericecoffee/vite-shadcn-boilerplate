// src/components/assignment/assignment-screenshots.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ImageIcon, ZoomInIcon } from 'lucide-react';
import { getFullUrl } from '@/lib/api';
import { Assignment } from '@/types/assignment';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AssignmentScreenshotsProps {
  screenshots: Assignment['screenshots'];
}

export function AssignmentScreenshots({ screenshots }: AssignmentScreenshotsProps) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon size={18} className="mr-2" />
          Assignment Screenshots
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Main Screenshot Carousel */}
        <div className="rounded-lg overflow-hidden border mb-4">
          <Carousel className="w-full">
            <CarouselContent>
              {screenshots.map((screenshot, index) => (
                screenshot.image && (
                  <CarouselItem key={screenshot.id || index}>
                    <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                      <img 
                        src={getFullUrl(screenshot.image.url)} 
                        alt={screenshot.caption || `Screenshot ${index + 1}`}
                        className="max-h-full object-contain"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="absolute bottom-4 right-4 bg-background/80 hover:bg-background"
                            onClick={() => {
                              if (screenshot.image?.url) {
                                setSelectedScreenshot(getFullUrl(screenshot.image.url) || null);
                              }
                            }}
                          >
                            <ZoomInIcon size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh]">
                          <div className="w-full h-full flex items-center justify-center">
                            {selectedScreenshot && (
                              <img 
                                src={selectedScreenshot}
                                alt={screenshot.caption || `Screenshot ${index + 1}`}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {screenshot.caption && (
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        {screenshot.caption}
                      </p>
                    )}
                  </CarouselItem>
                )
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
        
        {/* Thumbnails gallery */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {screenshots.map((screenshot, index) => (
            screenshot.image && (
              <div 
                key={`thumb-${screenshot.id || index}`}
                className="flex-shrink-0 w-24 h-16 border rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  if (screenshot.image?.url) {
                    setSelectedScreenshot(getFullUrl(screenshot.image.url) || null);
                  }
                }}
              >
                <img 
                  src={getFullUrl(screenshot.image.url)} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
}