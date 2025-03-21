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
      <h1 className="text-3xl font-bold tracking-tight mb-8">Leerlingen</h1>
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
  );
};