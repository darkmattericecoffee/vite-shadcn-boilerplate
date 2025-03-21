// src/pages/LearningPathsPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLearningPaths, getFullUrl } from '@/lib/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LayersIcon, CalendarIcon, ChevronRightIcon, BookOpenIcon } from 'lucide-react';
import { LearningPath } from '@/types/learning-path';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const LearningPathsPage = () => {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setLoading(true);
        const data = await getLearningPaths();
        setLearningPaths(data.learningPaths);
      } catch (error) {
        console.error('Error fetching learning paths:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLearningPaths();
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
      <h1 className="text-3xl font-bold tracking-tight mb-8">Learning Paths</h1>
      {learningPaths.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {learningPaths.map((path) => {
            // Sort assignments by orderInPath if available
            const sortedAssignments = path.assignments 
              ? [...path.assignments].sort((a, b) => {
                  if (a.orderInPath !== undefined && b.orderInPath !== undefined) {
                    return a.orderInPath - b.orderInPath;
                  }
                  return 0;
                })
              : [];
              
            return (
              <Card key={path.id} className="hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                <Link to={`/learning-paths/${path.id}`} className="group">
                  {path.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={getFullUrl(path.coverImage.url)} 
                        alt={`${path.title} cover image`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                      <LayersIcon size={20} className="mr-2" />
                      {path.title}
                    </CardTitle>
                  </CardHeader>
                </Link>
                
                <CardContent className="flex-grow flex flex-col">
                  {path.createdAt && (
                    <div className="flex items-center text-muted-foreground mb-3">
                      <CalendarIcon size={16} className="mr-2" />
                      <span>Created: {new Date(path.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {path.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {getPlainTextDescription(path.description.document)}
                    </p>
                  )}
                  
                  {/* Assignment preview section */}
                  {sortedAssignments.length > 0 && (
                    <div className="mt-auto">
                      <div className="flex items-center mb-3">
                        <BookOpenIcon size={16} className="mr-2" />
                        <h3 className="font-medium">Assignments</h3>
                        <Badge variant="secondary" className="ml-2">
                          {sortedAssignments.length}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Show first 3 assignments as a preview */}
                        {sortedAssignments.slice(0, 3).map((assignment, index) => (
                          <Link 
                            key={assignment.id} 
                            to={`/assignments/${assignment.id}`}
                            className="flex items-start gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                            state={{ from: 'learning-path' }}  // Add this state parameter
                          >
                            <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                              {index + 1}
                            </Badge>
                            <span className="text-sm font-medium truncate">
                              {assignment.title}
                            </span>
                          </Link>
                        ))}
                        
                        {/* If there are more than 3 assignments, show a "more" indicator */}
                        {sortedAssignments.length > 3 && (
                          <div className="text-center text-sm text-muted-foreground pt-1">
                            +{sortedAssignments.length - 3} more assignments
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button variant="default" asChild className="w-full">
                    <Link to={`/learning-paths/${path.id}`} className="flex items-center justify-center">
                      <ChevronRightIcon size={16} className="mr-2" />
                      View Learning Path
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No learning paths found.</p>
        </div>
      )}
    </div>
  );
};

export { LearningPathsPage };