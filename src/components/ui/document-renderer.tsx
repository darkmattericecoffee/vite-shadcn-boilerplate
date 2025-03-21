// src/components/ui/document-renderer.tsx
import React, { ReactNode } from 'react';
import { DocumentRenderer as KeystoneDocumentRenderer } from '@keystone-6/document-renderer';
import '../../styles/document-content.css'; // Import the CSS file

// Custom renderers for different document node types
const renderers = {
  // Text formatting
  inline: {
    bold: ({ children }: { children: ReactNode }) => {
      return <strong className="font-bold">{children}</strong>;
    },
    italic: ({ children }: { children: ReactNode }) => {
      return <em className="italic">{children}</em>;
    },
    underline: ({ children }: { children: ReactNode }) => {
      return <span className="underline">{children}</span>;
    },
    strikethrough: ({ children }: { children: ReactNode }) => {
      return <span className="line-through">{children}</span>;
    },
    code: ({ children }: { children: ReactNode }) => {
      return <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm">{children}</code>;
    },
    superscript: ({ children }: { children: ReactNode }) => {
      return <sup>{children}</sup>;
    },
    subscript: ({ children }: { children: ReactNode }) => {
      return <sub>{children}</sub>;
    },
    keyboard: ({ children }: { children: ReactNode }) => {
      return <kbd className="px-1 py-0.5 text-xs font-semibold border rounded">{children}</kbd>;
    },
  },
  // Block elements
  block: {
    paragraph: ({ children }: { children: ReactNode }) => {
      return <p className="mb-4 last:mb-0 ">{children}</p>;
    },
    blockquote: ({ children }: { children: ReactNode }) => {
      return <blockquote className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-700 dark:text-gray-300">{children}</blockquote>;
    },
    heading: ({ level, children }: { level: number, children: ReactNode }) => {
      switch (level) {
        case 1:
          return <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>;
        case 2:
          return <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>;
        case 3:
          return <h3 className="text-xl font-bold mb-3 mt-4">{children}</h3>;
        case 4:
          return <h4 className="text-lg font-bold mb-2 mt-4 ">{children}</h4>;
        case 5:
          return <h5 className="text-base font-bold mb-2 mt-3">{children}</h5>;
        case 6:
          return <h6 className="text-sm font-bold mb-2 mt-3">{children}</h6>;
        default:
          return <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>;
      }
    },
    code: ({ children, language }: { children: ReactNode, language?: string }) => {
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto mb-4">
          <code className={language ? `language-${language}` : ''}>{children}</code>
        </pre>
      );
    },
    divider: () => {
      return <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />;
    },
    // Lists (using classes from our CSS file)
    unordered_list: ({ children }: { children: ReactNode }) => {
      return <ul>{children}</ul>;
    },
    ordered_list: ({ children }: { children: ReactNode }) => {
      return <ol>{children}</ol>;
    },
    list_item: ({ children }: { children: ReactNode }) => {
      return <li>{children}</li>;
    },
    // Layout components
    layout: ({ layout, children }: { layout: any[], children: ReactNode[] }) => {
      return (
        <div className={`grid grid-cols-${layout.length} gap-4 mb-6`}>
          {children.map((element: ReactNode, i: number) => (
            <div key={i}>{element}</div>
          ))}
        </div>
      );
    },
  },
  // Link handling
  link: ({ href, children }: { href: string, children: ReactNode }) => {
    return (
      <a 
        href={href} 
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },
};

interface DocumentRendererProps {
  document: any;
  className?: string;
}

export function CustomDocumentRenderer({ document, className }: DocumentRendererProps) {
  if (!document) return null;
  
  return (
    <div className={`document-content ${className || ''}`}>
      <KeystoneDocumentRenderer document={document} renderers={renderers} />
    </div>
  );
}