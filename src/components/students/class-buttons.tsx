// src/components/ClassButtons.tsx
import React from 'react';
import { BookOpenIcon, CalendarIcon } from 'lucide-react';

interface ClassButtonsProps {
  classes: { id: string; name: string }[];
  selectedClassId: string | null;
  onClassSelect: (classId: string | null) => void;
  graduationYears: number[];
  selectedGraduationYear: number | null;
  onGraduationYearSelect: (year: number | null) => void;
}

// Function to generate a color based on class name
const getClassColor = (className: string): string => {
  const colors = [
    'bg-blue-500 hover:bg-blue-600',
    'bg-purple-500 hover:bg-purple-600',
    'bg-green-500 hover:bg-green-600',
    'bg-red-500 hover:bg-red-600',
    'bg-yellow-500 hover:bg-yellow-600',
    'bg-pink-500 hover:bg-pink-600',
    'bg-indigo-500 hover:bg-indigo-600',
    'bg-teal-500 hover:bg-teal-600',
  ];
  
  // Simple hash function to map class name to a color
  const hash = className.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
};

export const ClassButtons = ({
  classes,
  selectedClassId,
  onClassSelect,
  graduationYears,
  selectedGraduationYear,
  onGraduationYearSelect,
}: ClassButtonsProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Klassen</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onClassSelect(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition-colors 
              ${selectedClassId === null 
                ? 'bg-gray-800 hover:bg-gray-900' 
                : 'bg-gray-500 hover:bg-gray-600'}`}
          >
            <BookOpenIcon size={16} />
            Alle klassen
          </button>
          
          {classes.map((classItem) => (
            <button
              key={classItem.id}
              onClick={() => onClassSelect(classItem.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition-colors
                ${selectedClassId === classItem.id 
                  ? `${getClassColor(classItem.name)} ring-2 ring-offset-2 ring-offset-white ring-blue-300` 
                  : getClassColor(classItem.name)}`}
            >
              <BookOpenIcon size={16} />
              {classItem.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Afstudeerjaar</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onGraduationYearSelect(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition-colors 
              ${selectedGraduationYear === null 
                ? 'bg-gray-800 hover:bg-gray-900' 
                : 'bg-gray-500 hover:bg-gray-600'}`}
          >
            <CalendarIcon size={16} />
            Alle jaren
          </button>
          
          {graduationYears.map((year) => (
            <button
              key={year}
              onClick={() => onGraduationYearSelect(year)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors
                ${selectedGraduationYear === year 
                  ? 'ring-2 ring-offset-2 ring-offset-white ring-amber-300' 
                  : ''}`}
            >
              <CalendarIcon size={16} />
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};