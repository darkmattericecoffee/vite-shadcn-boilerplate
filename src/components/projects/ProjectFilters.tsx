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
import { FilterIcon, XIcon } from 'lucide-react';

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
  // Updated 'data-viz' to 'data_viz' to match the backend change
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
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <FilterIcon size={18} className="mr-2" />
          Filter Projecten
        </h2>
        
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Leerling</label>
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
          <label className="text-sm font-medium block mb-2">Leerpad</label>
          <Select value={selectedLearningPath} onValueChange={onLearningPathChange}>
            <SelectTrigger>
              <SelectValue placeholder="All learning paths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All leerpaden</SelectItem>
              {learningPaths.map((learningPath) => (
                <SelectItem key={learningPath.id} value={learningPath.id}>
                  {learningPath.title}
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
              <SelectItem value="all">All types</SelectItem>
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