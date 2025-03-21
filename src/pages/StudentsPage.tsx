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

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2); // Limit to 2 characters
};

// Helper function to generate a consistent color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  
  // Simple hash function to pick a consistent color
  const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charSum % colors.length];
};

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
          <div key={index} className="bg-muted animate-pulse h-40 rounded-lg"></div>
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
            <Card key={student.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {/* Avatar circle with initials */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-medium ${getAvatarColor(student.name)}`}>
                    {getInitials(student.name)}
                  </div>
                  <div>
                    <CardTitle>{student.name}</CardTitle>
                    {student.class && (
                      <CardDescription>Class: {student.class}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link to={`/projects?student=${student.id}`} className="flex items-center justify-center gap-2">
                    <GraduationCapIcon size={16} />
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