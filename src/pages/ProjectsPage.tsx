// src/pages/ProjectsPage.tsx with 3-column grid and updated card style
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { 
  getProjects, 
  getStudents, 
  getAssignments, 
  getProgrammingLanguages,
  getLearningPaths 
} from '@/lib/api';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced project card wrapper to match the new design
const ProjectCardWrapper = ({ project }: { project: any }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ProjectCard project={project} />
    </div>
  );
};

// Lazy loader for project cards
const LazyProjectCard = ({ project }: { project: any }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px'
  });

  return (
    <div ref={ref} className="w-full">
      {inView ? (
        <ProjectCardWrapper project={project} />
      ) : (
        <div className="bg-muted animate-pulse h-96 rounded-lg" />
      )}
    </div>
  );
};

const ProjectsPage = () => {
  // Filter state
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStudent, setSelectedStudent] = useState<string>(
    searchParams.get('student') || 'all'
  );
  const [selectedAssignment, setSelectedAssignment] = useState<string>(
    searchParams.get('assignment') || 'all'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    searchParams.get('language') || 'all'
  );
  const [selectedType, setSelectedType] = useState<string>(
    searchParams.get('type') || 'all'
  );
  const [selectedLearningPath, setSelectedLearningPath] = useState<string>(
    searchParams.get('learningPath') || 'all'
  );
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(
    searchParams.get('featured') === 'true'
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sort') || 'newest'
  );
  
  // Data state
  const [projects, setProjects] = useState<any[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [assignments, setAssignments] = useState<{ id: string; name: string }[]>([]);
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);
  const [learningPaths, setLearningPaths] = useState<{ id: string; title: string }[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch projects based on the current filters
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create a clean filter object excluding 'all' values
      const params = {
        studentId: selectedStudent !== 'all' ? selectedStudent : undefined,
        assignmentId: selectedAssignment !== 'all' ? selectedAssignment : undefined,
        learningPathId: selectedLearningPath !== 'all' ? selectedLearningPath : undefined,
        languageId: selectedLanguage !== 'all' ? selectedLanguage : undefined,
        projectType: selectedType !== 'all' ? selectedType : undefined,
        featured: showFeaturedOnly || undefined
      };
      
      console.log("Fetching projects with params:", params);
      
      const data = await getProjects(params);
      
      // Validate data structure
      if (!data || !data.projects) {
        throw new Error("Invalid data structure returned from API");
      }
      
      let sortedProjects = [...data.projects];
      
      // Apply sorting
      if (sortBy === 'newest') {
        sortedProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === 'oldest') {
        sortedProjects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sortBy === 'title-asc') {
        sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'title-desc') {
        sortedProjects.sort((a, b) => b.title.localeCompare(a.title));
      }
      
      setProjects(sortedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again later.');
      setProjects([]); // Reset projects to avoid showing stale data
    } finally {
      setIsLoading(false);
    }
  };

  // Common function for updating filters
  const updateFilter = (paramName: string, value: string | boolean) => {
    if (typeof value === 'string') {
      if (value === 'all') {
        searchParams.delete(paramName);
      } else {
        searchParams.set(paramName, value);
      }
    } else if (typeof value === 'boolean') {
      if (value) {
        searchParams.set(paramName, 'true');
      } else {
        searchParams.delete(paramName);
      }
    }
    
    setSearchParams(searchParams);
    fetchProjects();
  };
  
  // Refactored filter handlers
  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
    updateFilter('student', value);
  };
  
  const handleAssignmentChange = (value: string) => {
    setSelectedAssignment(value);
    updateFilter('assignment', value);
  };
  
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    updateFilter('language', value);
  };
  
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    updateFilter('type', value);
  };
  
  const handleLearningPathChange = (value: string) => {
    setSelectedLearningPath(value);
    updateFilter('learningPath', value);
  };
  
  const handleFeaturedChange = () => {
    const newValue = !showFeaturedOnly;
    setShowFeaturedOnly(newValue);
    updateFilter('featured', newValue);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    searchParams.set('sort', value);
    setSearchParams(searchParams);
    
    // Re-sort existing projects without fetching
    let sortedProjects = [...projects];
    
    if (value === 'newest') {
      sortedProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (value === 'oldest') {
      sortedProjects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (value === 'title-asc') {
      sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === 'title-desc') {
      sortedProjects.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    setProjects(sortedProjects);
  };
  
  const clearFilters = () => {
    setSelectedStudent('all');
    setSelectedAssignment('all');
    setSelectedLanguage('all');
    setSelectedType('all');
    setSelectedLearningPath('all');
    setShowFeaturedOnly(false);
    
    // Clear URL parameters but keep sort
    const sort = searchParams.get('sort');
    setSearchParams(sort ? { sort } : {});
    
    fetchProjects();
  };
  
  // Load initial data and set up filters from URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all the required data with better error handling
        const results = await Promise.allSettled([
          getStudents(),
          getAssignments(),
          getProgrammingLanguages(),
          getLearningPaths()
        ]);
        
        // Process results safely
        const [studentsResult, assignmentsResult, languagesResult, learningPathsResult] = results;
        
        if (studentsResult.status === 'fulfilled' && studentsResult.value?.students) {
          setStudents(studentsResult.value.students.map((student: any) => ({
            id: student.id,
            name: student.name
          })));
        }
        
        if (assignmentsResult.status === 'fulfilled' && assignmentsResult.value?.assignments) {
          setAssignments(assignmentsResult.value.assignments.map((assignment: any) => ({
            id: assignment.id,
            name: assignment.title
          })));
        }
        
        if (languagesResult.status === 'fulfilled' && languagesResult.value?.programmingLanguages) {
          setLanguages(languagesResult.value.programmingLanguages.map((language: any) => ({
            id: language.id,
            name: language.name
          })));
        }
        
        if (learningPathsResult.status === 'fulfilled' && learningPathsResult.value?.learningPaths) {
          setLearningPaths(learningPathsResult.value.learningPaths.map((path: any) => ({
            id: path.id,
            title: path.title
          })));
        }
        
        // Then fetch projects with any initial filters from URL
        await fetchProjects();
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to load project data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    // Intentionally not including fetchProjects in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
        <ProjectFilters
          students={students}
          assignments={assignments}
          languages={languages}
          learningPaths={learningPaths}
          selectedStudent={selectedStudent}
          selectedAssignment={selectedAssignment}
          selectedLanguage={selectedLanguage}
          selectedType={selectedType}
          selectedLearningPath={selectedLearningPath}
          onStudentChange={handleStudentChange}
          onAssignmentChange={handleAssignmentChange}
          onLanguageChange={handleLanguageChange}
          onTypeChange={handleTypeChange}
          onLearningPathChange={handleLearningPathChange}
          onClearFilters={clearFilters}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">Leerling Projecten</h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              size="sm"
              onClick={handleFeaturedChange}
              className="flex items-center"
            >
              <StarIcon size={16} className={`mr-2 ${showFeaturedOnly ? "text-yellow-500" : ""}`} />
              {showFeaturedOnly ? "Alleen Uitgelicht" : "Toon Uitgelicht"}
            </Button>
            
            <Tabs value={sortBy} onValueChange={handleSortChange} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="newest">Nieuwste</TabsTrigger>
                <TabsTrigger value="oldest">Oudste</TabsTrigger>
                <TabsTrigger value="title-asc">A-Z</TabsTrigger>
                <TabsTrigger value="title-desc">Z-A</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-muted animate-pulse h-96 rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={fetchProjects}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Geen projecten gevonden die overeenkomen met je filters.</p>
            {(selectedStudent !== 'all' || 
              selectedAssignment !== 'all' || 
              selectedLanguage !== 'all' || 
              selectedType !== 'all' || 
              selectedLearningPath !== 'all' || 
              showFeaturedOnly) && (
              <Button 
                onClick={clearFilters}
                className="mt-4"
              >
                Filters wissen
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <LazyProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { ProjectsPage };