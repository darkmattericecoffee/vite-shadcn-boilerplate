// src/pages/ProjectsPage.tsx
import React, { useEffect, useState } from 'react';
import { ProjectFilters, ProjectList } from '@/components/projects/ProjectList';
import { getProjects, getStudents, getAssignments, getProgrammingLanguages } from '@/lib/api';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states - initialize with 'all' instead of empty strings
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const studentsData = await getStudents();
        setStudents(studentsData.students);
        
        const assignmentsData = await getAssignments();
        setAssignments(assignmentsData.assignments);
        
        const languagesData = await getProgrammingLanguages();
        setLanguages(languagesData.programmingLanguages);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Fetch projects with filters
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects({
          studentId: selectedStudent !== 'all' ? selectedStudent : undefined,
          assignmentId: selectedAssignment !== 'all' ? selectedAssignment : undefined,
          languageId: selectedLanguage !== 'all' ? selectedLanguage : undefined,
          projectType: selectedType !== 'all' ? selectedType : undefined
        });
        setProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [selectedStudent, selectedAssignment, selectedLanguage, selectedType]);

  const handleClearFilters = () => {
    setSelectedStudent('all');
    setSelectedAssignment('all');
    setSelectedLanguage('all');
    setSelectedType('all');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">All Projects</h1>
      
      <ProjectFilters
        students={students}
        assignments={assignments}
        languages={languages}
        selectedStudent={selectedStudent}
        selectedAssignment={selectedAssignment}
        selectedLanguage={selectedLanguage}
        selectedType={selectedType}
        onStudentChange={setSelectedStudent}
        onAssignmentChange={setSelectedAssignment}
        onLanguageChange={setSelectedLanguage}
        onTypeChange={setSelectedType}
        onClearFilters={handleClearFilters}
      />
      
      <ProjectList projects={projects} loading={loading} />
    </div>
  );
};