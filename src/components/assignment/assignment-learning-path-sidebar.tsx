// src/components/assignments/learning-path-sidebar.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckIcon, LayersIcon } from 'lucide-react';

interface LearningPathSidebarProps {
  learningPaths: { id: string; title: string }[];
  selectedLearningPathId: string | null;
  onLearningPathSelect: (learningPathId: string | null) => void;
}

export const LearningPathSidebar = ({
  learningPaths,
  selectedLearningPathId,
  onLearningPathSelect,
}: LearningPathSidebarProps) => {
  return (
    <div className=" border w-56 border-r h-full rounded-lg p-4">
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <LayersIcon size={16} />
          Leerpaden
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="pt-2">
          <Button
            variant={selectedLearningPathId === null ? "secondary" : "ghost"}
            className="w-full justify-start mb-1"
            onClick={() => onLearningPathSelect(null)}
          >
            <div className="flex items-center w-full">
              <span>Alle leerpaden</span>
              {selectedLearningPathId === null && (
                <CheckIcon size={16} className="ml-auto" />
              )}
            </div>
          </Button>
          
          {learningPaths.map((learningPath) => (
            <Button
              key={learningPath.id}
              variant={selectedLearningPathId === learningPath.id ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => onLearningPathSelect(learningPath.id)}
            >
              <div className="flex items-center w-full">
                <span>{learningPath.title}</span>
                {selectedLearningPathId === learningPath.id && (
                  <CheckIcon size={16} className="ml-auto" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};