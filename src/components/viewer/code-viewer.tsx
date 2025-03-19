// src/components/ui/code-viewer.tsx
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface CodeViewerProps {
  fileUrl: string;
  fileName: string;
}

export function CodeViewer({ fileUrl, fileName }: CodeViewerProps) {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true);
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        setCode(text);
        setError(null);
      } catch (err) {
        console.error('Error fetching code:', err);
        setError(err instanceof Error ? err.message : 'Failed to load code file');
      } finally {
        setLoading(false);
      }
    };

    if (fileUrl) {
      fetchCode();
    }
  }, [fileUrl]);

  // Basic file extension to language mapping
  const getLanguageFromFilename = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
      py: 'python',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      cs: 'csharp',
      php: 'php',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      swift: 'swift',
      kt: 'kotlin',
      json: 'json',
      xml: 'xml',
      md: 'markdown',
      sql: 'sql',
      sh: 'bash',
      bat: 'batch',
      ps1: 'powershell',
      yaml: 'yaml',
      yml: 'yaml',
      txt: 'plaintext',
    };
    
    return languageMap[extension] || 'plaintext';
  };

  const language = getLanguageFromFilename(fileName);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading code...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive border border-destructive/20 rounded-md bg-destructive/10">
        <p className="font-medium">Failed to load code file</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  // We're using a pre tag with syntax highlighting classes
  // This assumes you have a syntax highlighting library (like Prism or Highlight.js) included
  return (
    <div className="code-viewer">
      <div className="code-header border-b px-4 py-2 flex justify-between items-center bg-muted">
        <span className="font-mono text-sm">{fileName}</span>
        <span className="text-xs uppercase px-2 py-1 rounded-full bg-muted-foreground/20">{language}</span>
      </div>
      <pre className={`language-${language} p-4 overflow-auto max-h-[80vh] text-sm font-mono`}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}