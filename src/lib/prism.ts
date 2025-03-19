// src/lib/prism.ts
// This file handles loading Prism.js for syntax highlighting

// We need to import this in a component that loads before any code is displayed
// For example, in your main layout or in the component that displays code
export const loadPrism = () => {
    // This function should be called in a useEffect hook
    
    // First, check if Prism is already loaded to avoid duplicate loading
    if ((window as any).Prism) {
      (window as any).Prism.highlightAll();
      return;
    }
    
    // Create link element for Prism CSS
    const prismCSSLink = document.createElement('link');
    prismCSSLink.rel = 'stylesheet';
    prismCSSLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
    document.head.appendChild(prismCSSLink);
    
    // Create script element for Prism JS
    const prismScript = document.createElement('script');
    prismScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
    prismScript.async = true;
    prismScript.onload = () => {
      // Load additional languages
      const languages = [
        'javascript', 'typescript', 'jsx', 'tsx', 'css', 'scss',
        'html', 'python', 'java', 'c', 'cpp', 'csharp', 'go',
        'rust', 'swift', 'ruby', 'kotlin', 'php', 'sql', 'bash'
      ];
      
      // Load each language component
      languages.forEach(lang => {
        const script = document.createElement('script');
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
        script.async = true;
        document.body.appendChild(script);
      });
      
      // Highlight all code blocks
      setTimeout(() => {
        if ((window as any).Prism) {
          (window as any).Prism.highlightAll();
        }
      }, 500);
    };
    
    document.body.appendChild(prismScript);
  };