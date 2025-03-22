// src/pages/StudentsPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudents } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { GraduationCapIcon } from 'lucide-react';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
// Import our updated Student interface and helper
import { Student, formatGraduationYear } from '@/types/student';
// Import our new components
import { ClassSidebar } from '@/components/students/class-sidebar';
import { ClassButtons } from '@/components/students/class-buttons';

export const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<{id: string; name: string}[]>([]);
  const [graduationYears, setGraduationYears] = useState<number[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedGraduationYear, setSelectedGraduationYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(
    window.innerWidth > 768 ? 'desktop' : 'mobile'
  );

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth > 768 ? 'desktop' : 'mobile');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getStudents();
        setAllStudents(data.students);
        setStudents(data.students);

        // Extract unique classes from students
        const uniqueClasses = Array.from(
          new Map<string, { id: string; name: string }>(
            data.students
              .filter((student: Student) => student.class)
              .map((student: Student) => [student.class!.id, student.class!])
          ).values()
        );
        
        // Extract unique graduation years
        const uniqueYears: number[] = Array.from(
          new Set<number>(
            data.students
              .filter((student: Student) => student.graduationYear)
              .map((student: Student) => parseInt(formatGraduationYear(student.graduationYear!), 10))
          )
        ).sort((a, b) => a - b);
        
        setClasses(uniqueClasses);
        setGraduationYears(uniqueYears);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  // Filter students when filters change
  useEffect(() => {
    let filteredStudents = allStudents;
    
    // Apply class filter
    if (selectedClassId !== null) {
      filteredStudents = filteredStudents.filter(
        (student: Student) => student.class && student.class.id === selectedClassId
      );
    }
    
    // Apply graduation year filter
    if (selectedGraduationYear !== null) {
      filteredStudents = filteredStudents.filter(
        (student: Student) => student.graduationYear && 
          parseInt(formatGraduationYear(student.graduationYear), 10) === selectedGraduationYear
      );
    }
    
    setStudents(filteredStudents);
  }, [selectedClassId, selectedGraduationYear, allStudents]);

  const handleClassSelect = (classId: string | null) => {
    setSelectedClassId(classId);
  };
  
  const handleGraduationYearSelect = (year: number | null) => {
    setSelectedGraduationYear(year);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-muted animate-pulse h-40 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar for desktop view */}
      {viewMode === 'desktop' && (
        <ClassSidebar 
          classes={classes} 
          selectedClassId={selectedClassId} 
          onClassSelect={handleClassSelect}
          graduationYears={graduationYears}
          selectedGraduationYear={selectedGraduationYear}
          onGraduationYearSelect={handleGraduationYearSelect}
        />
      )}
      
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Leerlingen</h1>
        
        {/* Filter buttons for both mobile and desktop */}
        <ClassButtons 
          classes={classes} 
          selectedClassId={selectedClassId} 
          onClassSelect={handleClassSelect}
          graduationYears={graduationYears}
          selectedGraduationYear={selectedGraduationYear}
          onGraduationYearSelect={handleGraduationYearSelect}
        />
        
        {students.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card key={student.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {/* Avatar circle with initials using our component */}
                    <InitialsAvatar name={student.name} />
                    <div>
                      <CardTitle>{student.name}</CardTitle>
                      {student.class && (
                        <CardDescription>Klas: {student.class.name}</CardDescription>
                      )}
                      {student.graduationYear && (
                        <CardDescription>
                          Afstudeerjaar: {formatGraduationYear(student.graduationYear)}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link to={`/projects?student=${student.id}`} className="flex items-center justify-center gap-2">
                      <GraduationCapIcon size={16} />
                      Toon projecten
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Geen leerlingen gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
};