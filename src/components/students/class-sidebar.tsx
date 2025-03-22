// src/components/ClassSidebar.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckIcon } from 'lucide-react';

interface ClassSidebarProps {
  classes: { id: string; name: string }[];
  selectedClassId: string | null;
  onClassSelect: (classId: string | null) => void;
  graduationYears: number[];
  selectedGraduationYear: number | null;
  onGraduationYearSelect: (year: number | null) => void;
}

export const ClassSidebar = ({
  classes,
  selectedClassId,
  onClassSelect,
  graduationYears,
  selectedGraduationYear,
  onGraduationYearSelect,
}: ClassSidebarProps) => {
  return (
    <div className="w-56 border-r h-full pr-1">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Klassen</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-2">
          <Button
            variant={selectedClassId === null ? "secondary" : "ghost"}
            className="w-full justify-start mb-1"
            onClick={() => onClassSelect(null)}
          >
            <div className="flex items-center w-full">
              <span>Alle klassen</span>
              {selectedClassId === null && (
                <CheckIcon size={16} className="ml-auto" />
              )}
            </div>
          </Button>
          
          {classes.map((classItem) => (
            <Button
              key={classItem.id}
              variant={selectedClassId === classItem.id ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => onClassSelect(classItem.id)}
            >
              <div className="flex items-center w-full">
                <span>{classItem.name}</span>
                {selectedClassId === classItem.id && (
                  <CheckIcon size={16} className="ml-auto" />
                )}
              </div>
            </Button>
          ))}
          
          <Separator className="my-4" />
          
          <h2 className="font-semibold mb-2">Afstudeerjaar</h2>
          
          <Button
            variant={selectedGraduationYear === null ? "secondary" : "ghost"}
            className="w-full justify-start mb-1"
            onClick={() => onGraduationYearSelect(null)}
          >
            <div className="flex items-center w-full">
              <span>Alle jaren</span>
              {selectedGraduationYear === null && (
                <CheckIcon size={16} className="ml-auto" />
              )}
            </div>
          </Button>
          
          {graduationYears.map((year) => (
            <Button
              key={year}
              variant={selectedGraduationYear === year ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => onGraduationYearSelect(year)}
            >
              <div className="flex items-center w-full">
                <span>{year}</span>
                {selectedGraduationYear === year && (
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