// src/components/assignments/learning-path-buttons.tsx
import React from 'react';
import { BookOpenIcon, LayersIcon } from 'lucide-react';

interface LearningPathButtonsProps {
  learningPaths: { id: string; title: string }[];
  selectedLearningPathId: string | null;
  onLearningPathSelect: (learningPathId: string | null) => void;
}

// Function to generate a color based on learning path title
const getLearningPathColor = (title: string): string => {
  const colors = [
    'bg-pink-500 hover:bg-pink-600',
    'bg-purple-500 hover:bg-purple-600',
    'bg-blue-500 hover:bg-blue-600',
    'bg-cyan-500 hover:bg-cyan-600',
    'bg-green-500 hover:bg-green-600',
    'bg-yellow-500 hover:bg-yellow-600',
    'bg-orange-500 hover:bg-orange-600',
    'bg-red-500 hover:bg-red-600',
  ];
  
  // Simple hash function to map learning path title to a color
  const hash = title.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
};

export const LearningPathButtons = ({
  learningPaths,
  selectedLearningPathId,
  onLearningPathSelect,
}: LearningPathButtonsProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Leerpaden</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onLearningPathSelect(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition-colors 
              ${selectedLearningPathId === null 
                ? 'bg-gray-800' 
                : 'bg-gray-700'}`}
          >
            <LayersIcon size={16} />
            Alle leerpaden
          </button>
          
          {learningPaths.map((learningPath) => (
            <button
              key={learningPath.id}
              onClick={() => onLearningPathSelect(learningPath.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition-colors
                ${getLearningPathColor(learningPath.title)}`}
            >
              <LayersIcon size={16} />
              {learningPath.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};