// src/components/projects/ProjectFilters.tsx
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterIcon, XIcon, UsersIcon } from 'lucide-react';

type FilterOption = {
  id: string;
  name: string;
};

type LearningPathOption = {
  id: string;
  title: string;
};

type ProjectFiltersProps = {
  students: FilterOption[];
  assignments: FilterOption[];
  languages: FilterOption[];
  learningPaths: LearningPathOption[];
  selectedStudent: string;
  selectedAssignment: string;
  selectedLanguage: string;
  selectedType: string;
  selectedLearningPath: string;
  onStudentChange: (value: string) => void;
  onAssignmentChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onLearningPathChange: (value: string) => void;
  onClearFilters: () => void;
};

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  students,
  assignments,
  languages,
  learningPaths,
  selectedStudent,
  selectedAssignment,
  selectedLanguage,
  selectedType,
  selectedLearningPath,
  onStudentChange,
  onAssignmentChange,
  onLanguageChange,
  onTypeChange,
  onLearningPathChange,
  onClearFilters,
}) => {
  const projectTypes = [
    { value: 'game', label: 'Game' },
    { value: 'app', label: 'Application' },
    { value: 'website', label: 'Website' },
    { value: 'poster', label: 'Poster' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'data_viz', label: 'Data Visualization' },
    { value: 'other', label: 'Other' },
  ];

  const hasActiveFilters = 
    selectedStudent !== 'all' || 
    selectedAssignment !== 'all' || 
    selectedLanguage !== 'all' || 
    selectedType !== 'all' ||
    selectedLearningPath !== 'all';

  return (
    <div className="border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
       
        <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <FilterIcon size={16} />
          Filteren
        </h2>
      </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <XIcon size={14} className="mr-1" />
            Wis filters
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2 flex items-center">
            <UsersIcon size={14} className="mr-1" />
            Leerling / Team
          </label>
          <Select value={selectedStudent} onValueChange={onStudentChange}>
            <SelectTrigger>
              <SelectValue placeholder="All students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle leerlingen</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-2">Leerpad</label>
          <Select value={selectedLearningPath} onValueChange={onLearningPathChange}>
            <SelectTrigger>
              <SelectValue placeholder="All learning paths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle leerpaden</SelectItem>
              {learningPaths.map((learningPath) => (
                <SelectItem key={learningPath.id} value={learningPath.id}>
                  {learningPath.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-2">Opdrachten</label>
          <Select value={selectedAssignment} onValueChange={onAssignmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="All assignments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle opdrachten</SelectItem>
              {assignments.map((assignment) => (
                <SelectItem key={assignment.id} value={assignment.id}>
                  {assignment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-2">Taal</label>
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle talen</SelectItem>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-2">Project Type</label>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle types</SelectItem>
              {projectTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};