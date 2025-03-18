// src/pages/AssignmentsPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments } from '@/lib/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BookOpenIcon, CalendarIcon } from 'lucide-react';

const AssignmentsPage = () => {
  interface Assignment {
    id: string;
    title: string;
    dueDate?: string;
  }
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await getAssignments();
        setAssignments(data.assignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-muted animate-pulse h-40 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Assignments</h1>
      
      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpenIcon size={20} className="mr-2" />
                  {assignment.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignment.dueDate && (
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon size={16} className="mr-2" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/projects?assignment=${assignment.id}`}>
                    View Projects
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No assignments found.</p>
        </div>
      )}
    </div>
  );
};

export { AssignmentsPage };