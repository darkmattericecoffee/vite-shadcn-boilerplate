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

interface Student {
  id: number;
  name: string;
  class?: string;
}

export const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getStudents();
        setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-muted animate-pulse h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Students</h1>
      
      {students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCapIcon size={20} className="mr-2" />
                  {student.name}
                </CardTitle>
                {student.class && (
                  <CardDescription>Class: {student.class}</CardDescription>
                )}
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/projects?student=${student.id}`}>
                    View Projects
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No students found.</p>
        </div>
      )}
    </div>
  );
};
