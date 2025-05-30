// src/components/project/project-sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileIcon,
  ImageIcon,
  CalendarIcon,
  ChevronRightIcon,
  BookOpenIcon,
  UserIcon,
  LinkIcon,
  ExternalLinkIcon,
  TagIcon,
  VideoIcon,
  FileTextIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFullUrl } from "@/lib/api";
import { Project } from "@/types/project";
import InitialsAvatar from "../ui/InitialsAvatar";

interface ProjectSidebarProps {
  project: Project;
  onSectionChange: (section: string) => void;
}

export function ProjectSidebar({
  project,
  onSectionChange,
}: ProjectSidebarProps) {
  // Handle both students (array) or legacy student (single object)
  const projectStudents =
    project.students || (project.student ? [project.student] : []);

  // Format dates
  const formattedSubmissionDate = project.submissionDate
    ? new Date(project.submissionDate).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const formattedCreationDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Check for different file types
  const hasFiles = Boolean(project.files && project.files.length > 0);
  const hasCodeFiles = Boolean(project.codeFiles && project.codeFiles.length > 0);
  const hasScreenshots = Boolean(
    project.screenshots && project.screenshots.length > 0
  );
  const hasLink = Boolean(project.link);
  const hasVideo = Boolean(project.embedCode);
  const hasStudents = projectStudents.length > 0;

  // Get the primary screenshot if available
  const featuredScreenshot =
    hasScreenshots && project.screenshots && project.screenshots[0]?.image?.url
      ? getFullUrl(project.screenshots[0].image.url)
      : null;

  // Get the primary file if available (prefer PDFs or presentations)
  const getFeaturedFile = () => {
    if (!hasFiles) return null;
    const preferredFile = project.files!.find(
      (file) =>
        file.file && (file.fileType === "pdf" || file.fileType === "ppt")
    );
    if (preferredFile && preferredFile.file) return preferredFile;
    return project.files![0].file ? project.files![0] : null;
  };

  const featuredFile = getFeaturedFile();

  // Helper for class name display
  const getClassName = (student: any) => {
    if (!student) return null;
    if (typeof student.class === "string") return student.class;
    if (student.class?.name) return student.class.name;
    return null;
  };

  return (
    <>
      {/* Student Information Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <UserIcon size={18} className="mr-2" />
            Maker{projectStudents.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasStudents ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Leerling{projectStudents.length > 1 ? "en" : ""}
              </h3>
              {projectStudents.map((student, index) => (
                <div
                  key={student.id || index}
                  className="flex items-center p-3 bg-muted rounded-md mb-2"
                >
                  <InitialsAvatar
                    name={student.name}
                    size="s"
                    colorIndex={index}
                  />
                  <span className="font-medium ml-2">{student.name}</span>
                  {getClassName(student) && (
                    <span className="ml-2 text-muted-foreground">
                      ({getClassName(student)})
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Geen leerlingen gekoppeld
            </div>
          )}
          {/* Submission Date */}
          {formattedSubmissionDate && (
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Ingezonden op:</h3>
              <div className="flex items-center p-3 bg-muted rounded-md">
                <CalendarIcon
                  size={18}
                  className="mr-2 text-muted-foreground"
                />
                <span>{formattedSubmissionDate}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <TagIcon size={18} className="mr-2" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Creation Date */}
          {formattedCreationDate && (
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} className="text-muted-foreground" />
              <span className="text-sm">
                Gemaakt op: {formattedCreationDate}
              </span>
            </div>
          )}
          {/* Connected Learning Path */}
          {project.learningPath && (
            <div className="flex items-center gap-2">
              <BookOpenIcon size={16} className="text-muted-foreground" />
              <span className="text-sm">
                Leerpad:{" "}
                <Link
                  to={`/learning-paths/${project.learningPath.id}`}
                  className="text-primary hover:underline"
                >
                  {project.learningPath.title}
                </Link>
              </span>
            </div>
          )}
          {/* Assignment link if available */}
          {project.assignment && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-medium">Opdracht</h3>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                asChild
              >
                <Link to={`/assignments/${project.assignment.id}`}>
                  <div className="flex items-center">
                    <BookOpenIcon size={16} className="mr-2" />
                    <span className="truncate">{project.assignment.title}</span>
                  </div>
                  <ChevronRightIcon size={16} />
                </Link>
              </Button>
            </div>
          )}
          {/* Project Type */}
          {project.projectType && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Project Type</h3>
              <Badge variant="secondary" className="w-fit">
                {project.projectType}
              </Badge>
            </div>
          )}
          {/* Languages */}
          {project.languages && project.languages.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Programmeertalen</h3>
              <div className="flex flex-wrap gap-2">
                {project.languages.map((lang) => (
                  <Badge key={lang.id} variant="outline" className="w-fit">
                    {lang.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>    
      {/* Project Resources Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <FileIcon size={18} className="mr-2" />
            Inhoud
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasLink && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Live Project</h3>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => onSectionChange("link")}
              >
                <div className="flex items-center">
                  <LinkIcon size={16} className="mr-2" />
                  <span className="truncate">Toon Live Project</span>
                </div>
                <ExternalLinkIcon size={16} />
              </Button>
            </div>
          )}
          {hasVideo && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Video</h3>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => onSectionChange("video")}
              >
                <div className="flex items-center">
                  <VideoIcon size={16} className="mr-2" />
                  <span className="truncate">Bekijk Video</span>
                </div>
                <ChevronRightIcon size={16} />
              </Button>
            </div>
          )}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">Inhoud</h3>
            <div className="grid grid-cols-2 gap-2">
              {hasFiles && (
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                  onClick={() => onSectionChange("files")}
                >
                  <FileIcon size={16} className="mr-2" />
                  <span>
                    {project.files!.length} File
                    {project.files!.length !== 1 ? "s" : ""}
                  </span>
                </Button>
              )}
              {hasCodeFiles && (
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                  onClick={() => onSectionChange("codeFiles")}
                >
                  <FileTextIcon size={16} className="mr-2" />
                  <span>
                    {project.codeFiles!.length} Document
                    {project.codeFiles!.length !== 1 ? "s" : ""}
                  </span>
                </Button>
              )}
              {hasScreenshots && (
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                  onClick={() => onSectionChange("screenshots")}
                >
                  <ImageIcon size={16} className="mr-2" />
                  <span>
                    {project.screenshots!.length} Afbeelding
                    {project.screenshots!.length !== 1 ? "s" : ""}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>      
    </>
  );
}