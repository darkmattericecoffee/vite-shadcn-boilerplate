// src/components/learning-path/learning-path-objectives.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, BookOpenIcon, LightbulbIcon } from 'lucide-react';
import { LearningPath, LearningPathAssignment, LearningObjective } from '@/types/learning-path';

interface LearningPathObjectivesProps {
  learningPath: LearningPath;
  className?: string;
}

export function LearningPathObjectives({ learningPath, className = "" }: LearningPathObjectivesProps) {
  // Collect and deduplicate learning objectives from all assignments
  const allObjectives = useMemo(() => {
    if (!learningPath.assignments) return [];
    
    // Collect all objectives from assignments
    const objectives: LearningObjective[] = [];
    const seenIds = new Set<string>();
    
    // Loop through assignments and collect objectives
    learningPath.assignments.forEach(assignment => {
      if (!assignment.learningObjectives) return;
      assignment.learningObjectives.forEach(objective => {
        // Avoid duplicates by checking ID
        if (!seenIds.has(objective.id)) {
          seenIds.add(objective.id);
          // Add assignment title to objective for display
          const objectiveWithAssignment = {
            ...objective,
            assignmentTitle: assignment.title
          };
          objectives.push(objectiveWithAssignment as any);
        }
      });
    });
    
    // Sort by order
    return objectives.sort((a, b) => a.order - b.order);
  }, [learningPath.assignments]);
  
  // If no objectives found, don't render
  if (allObjectives.length === 0) {
    return null;
  }
  
  return (
    <Card className={`overflow-hidden border border-primary/20 rounded-lg ${className}`}>
      <CardHeader className="bg-indigo-50 border-b pb-3">
        <CardTitle className="flex items-center text-lg">
          <LightbulbIcon size={18} className="mr-2 text-blue-500" />
          Leerdoelen
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <ul className="space-y-3">
          {allObjectives.map((objective) => (
            <li key={objective.id} className="flex items-start">
              <CheckCircleIcon size={18} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">{objective.title}</p>
                {objective.description && (
                  <p className="text-xs text-muted-foreground mt-1">{objective.description}</p>
                )}
                {(objective as any).assignmentTitle && (
                  <div className="flex items-center mt-1">
                    <BookOpenIcon size={12} className="mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Van: {(objective as any).assignmentTitle}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}