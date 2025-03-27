// src/components/ui/universal-file-viewer.tsx
import React, { useState } from 'react';
import DocViewer, { DocViewerRenderers, IDocument } from "react-doc-viewer";
import { 
  FileIcon, 
  FileTextIcon, 
  FileImageIcon, 
  FileCode2Icon,
  FileTypeIcon,
  FileSpreadsheetIcon,
  PresentationIcon,
  ExternalLinkIcon,
  DownloadIcon,
  MaximizeIcon
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFullUrl } from '@/lib/api';

interface FileViewerProps {
  file: {
    filename: string;
    url: string;
    filesize?: number;
  };
  title?: string;
  description?: string;
  fileType?: string;
}

// Helper function to format file size
const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Helper function to determine file type based on extension
const determineFileType = (filename: string, declaredType?: string): string => {
  if (declaredType && declaredType !== 'other') return declaredType;
  
  const extension = getFileExtension(filename);
  
  // PDF files
  if (extension === 'pdf') return 'pdf';
  
  // Office documents
  if (['doc', 'docx'].includes(extension)) return 'doc';
  if (['xls', 'xlsx', 'csv'].includes(extension)) return 'xls';
  if (['ppt', 'pptx'].includes(extension)) return 'ppt';
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) return 'img';
  
  // Code files
  if (['txt', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp', 'cs', 'go', 'php', 'rb'].includes(extension)) return 'code';
  
  // Default
  return 'other';
};

// Helper to get icon based on file type
const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'pdf':
      return <FileTextIcon className="mr-2" />;
    case 'doc':
      return <FileIcon className="mr-2" />;
    case 'xls':
      return <FileSpreadsheetIcon className="mr-2" />;
    case 'ppt':
      return <PresentationIcon className="mr-2" />;
    case 'img':
      return <FileImageIcon className="mr-2" />;
    case 'code':
      return <FileCode2Icon className="mr-2" />;
    default:
      return <FileTypeIcon className="mr-2" />;
  }
};

export const UniversalFileViewer: React.FC<FileViewerProps> = ({ 
  file, 
  title,
  description,
  fileType: declaredFileType
}) => {
  const [activeTab, setActiveTab] = useState<string>('preview');
  // Configure DocViewer document
  const fileUrl = getFullUrl(file.url);
  const fileName = file.filename;
  const fileType = determineFileType(fileName, declaredFileType);
  
  // Create properly typed documents array for DocViewer
  const docs: IDocument[] = fileUrl 
    ? [{ 
        uri: fileUrl,
        fileType: getFileExtension(fileName) || undefined
      }] 
    : [];

  // Function to render the appropriate preview based on file type
  const renderPreview = () => {
    // If no fileUrl is available, show fallback view
    if (!fileUrl) {
      return renderFallbackView();
    }
    
    return (
      <div className="w-full h-full" style={{ minHeight: '300px' }}>
        <DocViewer
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          style={{ height: '100%', width: '100%', minHeight: '300px' }}
          config={{
            header: {
              disableHeader: true, // Hide default header since we have our own
              disableFileName: true,
              retainURLParams: true
            }
          }}
          theme={{
            primary: "#0f172a",     // Slate-900 (dark blue)
            secondary: "#ffffff",   // White
            tertiary: "#94a3b8",    // Slate-400 (light gray)
            text_primary: "#ffffff",
            text_secondary: "#0f172a",
            text_tertiary: "#64748b", // Slate-500
          }}
        />
      </div>
    );
  };

  // Fallback preview for unsupported files
  const renderFallbackView = () => {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-6xl mb-4">
          {getFileIcon(fileType)}
        </div>
        <h3 className="text-lg font-medium mb-2">{title || fileName}</h3>
        <p className="text-muted-foreground mb-4">
          This file type may not be supported for preview.
        </p>
        <div className="flex gap-2">
          <a href={fileUrl} download className="inline-block">
            <Button className="flex items-center">
              <DownloadIcon size={16} className="mr-2" />
              Download
            </Button>
          </a>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="flex items-center">
              <ExternalLinkIcon size={16} className="mr-2" />
              Open in Browser
            </Button>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-muted/40">
        <div className="flex items-center">
          {getFileIcon(fileType)}
          <span className="font-medium">{title || fileName}</span>
        </div>
        
        <div className="flex gap-2">
          <a href={fileUrl} download>
            <Button variant="outline" size="sm" className="flex items-center">
              <DownloadIcon size={14} className="mr-1" />
              Download
            </Button>
          </a>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <MaximizeIcon size={14} className="mr-1" />
                Full Screen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{title || fileName}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="preview" className="w-full h-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="info">File Info</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2">
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <ExternalLinkIcon size={14} className="mr-1" />
                        Open in New Tab
                      </Button>
                    </a>
                    
                    <a href={fileUrl} download>
                      <Button variant="default" size="sm" className="flex items-center">
                        <DownloadIcon size={14} className="mr-1" />
                        Download
                      </Button>
                    </a>
                  </div>
                </div>
                
                <TabsContent value="preview" className="mt-0 border-0 p-0" style={{ height: '70vh' }}>
                  {renderPreview()}
                </TabsContent>
                
                <TabsContent value="info" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Filename</h4>
                      <p className="text-muted-foreground">{fileName}</p>
                    </div>
                    
                    {title && (
                      <div>
                        <h4 className="font-medium mb-1">Title</h4>
                        <p className="text-muted-foreground">{title}</p>
                      </div>
                    )}
                    
                    {description && (
                      <div>
                        <h4 className="font-medium mb-1">Description</h4>
                        <p className="text-muted-foreground">{description}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-1">File Size</h4>
                      <p className="text-muted-foreground">{formatFileSize(file.filesize)}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">File Type</h4>
                      <p className="text-muted-foreground">{fileType.toUpperCase()}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="aspect-[16/9]">
        {renderPreview()}
      </div>
    </div>
  );
};