// src/components/project/project-code-files.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, FileTextIcon, DownloadIcon, FileType2Icon, EyeIcon } from 'lucide-react';
import { getFullUrl } from '@/lib/api';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { UniversalFileViewer } from '../viewer/universal-file-viewer';

interface CodeFile {
  id: string;
  description?: string;
  file: {
    filename: string;
    url: string;
    filesize?: number;
  };
}

interface ProjectCodeFilesProps {
  codeFiles: CodeFile[];
}

export function ProjectCodeFiles({ codeFiles }: ProjectCodeFilesProps) {
  if (!codeFiles || codeFiles.length === 0) {
    return null;
  }

  // Helper function to format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper function to determine file icon based on extension
  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileIcon size={20} />;
      case 'doc':
      case 'docx':
        return <FileTextIcon size={20} />;
      case 'ppt':
      case 'pptx':
        return <FileType2Icon size={20} />;
      default:
        return <FileIcon size={20} />;
    }
  };

  // Helper function to determine nice file extension display
  const getFileTypeDisplay = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'ppt':
      case 'pptx':
        return 'PowerPoint';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      case 'txt':
        return 'Text Document';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'Image';
      default:
        return extension ? extension.toUpperCase() : 'File';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileTextIcon size={18} className="mr-2" />
          {codeFiles.length} Document{codeFiles.length !== 1 && 'en'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {codeFiles.map((file) => (
            <div 
              key={file.id} 
              className="flex items-start p-3 border rounded-md hover:bg-muted/40 transition-colors"
            >
              <div className="mr-3 mt-1">
                {getFileIcon(file.file.filename)}
              </div>
              <div className="flex-1 mr-4">
                <div className="font-medium">{file.file.filename}</div>
                {file.description && (
                  <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                )}
                <div className="flex items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {getFileTypeDisplay(file.file.filename)} • {formatFileSize(file.file.filesize)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <EyeIcon size={14} />
                      <span>View</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh]">
                    <UniversalFileViewer 
                      file={file.file} 
                      title={file.file.filename}
                      description={file.description}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a 
                    href={getFullUrl(file.file.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-1"
                  >
                    <DownloadIcon size={14} />
                    <span>Download</span>
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}