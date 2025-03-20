// src/pages/AssignmentsPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments, getFullUrl } from '@/lib/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BookOpenIcon, CalendarIcon, ChevronRightIcon, FileTextIcon } from 'lucide-react';

const AssignmentsPage = () => {
  interface Screenshot {
    id: string;
    caption?: string;
    image: {
      url: string;
      width?: number;
      height?: number;
      filesize?: number;
    };
  }

  interface Assignment {
    id: string;
    title: string;
    description?: {
      document: any; // This will be a JSON document from KeystoneJS
    };
    dueDate?: string;
    screenshots?: Screenshot[];
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

  // Helper function to extract plain text from the document structure
  const getPlainTextDescription = (document: any) => {
    if (!document) return '';
    
    try {
      // Parse the document if it's a string
      const parsedDoc = typeof document === 'string' 
        ? JSON.parse(document) 
        : document;
      
      // Extract text content from paragraphs
      if (parsedDoc && parsedDoc.content) {
        return parsedDoc.content
          .filter((node: any) => node.type === 'paragraph')
          .map((para: any) => {
            if (para.content) {
              return para.content
                .filter((textNode: any) => textNode.type === 'text')
                .map((textNode: any) => textNode.text)
                .join('');
            }
            return '';
          })
          .join(' ')
          .substring(0, 150) + (parsedDoc.content.length > 1 ? '...' : '');
      }
    } catch (error) {
      console.error('Error parsing document:', error);
    }
    
    return '';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-muted animate-pulse h-64 rounded-lg"></div>
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
            <Link 
              to={`/assignments/${assignment.id}`} 
              key={assignment.id} 
              className="block group"
            >
              <Card className="hover:shadow-md transition-shadow overflow-hidden h-full">
                {assignment.screenshots && assignment.screenshots.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getFullUrl(assignment.screenshots[0].image.url)} 
                      alt={assignment.screenshots[0].caption || `${assignment.title} thumbnail`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                    <BookOpenIcon size={20} className="mr-2" />
                    {assignment.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignment.dueDate && (
                    <div className="flex items-center text-muted-foreground mb-3">
                      <CalendarIcon size={16} className="mr-2" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {assignment.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {getPlainTextDescription(assignment.description.document)}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="default" className="flex-1 pointer-events-none">
                    <div className="flex items-center justify-center">
                      <FileTextIcon size={16} className="mr-2" />
                      View Details
                    </div>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link 
                      to={`/projects?assignment=${assignment.id}`} 
                      className="flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChevronRightIcon size={16} className="mr-2" />
                      View Submissions
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </Link>
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