'use client';

import React, { useState } from 'react';

interface JsonDisplayProps {
  data: any;
  initialExpanded?: boolean;
  maxHeight?: string;
}

export const JsonDisplay: React.FC<JsonDisplayProps> = ({ 
  data, 
  initialExpanded = false,
  maxHeight = 'none'
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  
  // Format the JSON with proper indentation
  const formattedJson = JSON.stringify(data, null, 2);
  
  // Function to highlight JSON syntax
  const highlightJson = (json: string) => {
    // Replace JSON syntax with styled spans
    return json
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-blue-600'; // string
        if (/^"/.test(match) && /:$/.test(match)) {
          cls = 'text-gray-800 font-semibold'; // key
        } else if (/true|false/.test(match)) {
          cls = 'text-green-600'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-gray-500'; // null
        } else if (/^-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?$/.test(match)) {
          cls = 'text-purple-600'; // number
        }
        return `<span class="${cls}">${match}</span>`;
      });
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200/50 bg-white/80 shadow-sm hover:shadow transition-all duration-300">
      <div 
        className="p-2 bg-blue-50/80 border-b border-gray-200/50 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-medium text-blue-700 text-sm">
          {expanded ? 'Masquer' : 'Afficher'} JSON
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 text-blue-600 transition-transform duration-200 ${expanded ? 'transform rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {expanded && (
        <div className="relative">
          <div 
            className="p-4 overflow-auto font-mono text-sm bg-white/50"
            style={{ 
              minHeight: '100px',
              height: '300px',
              maxHeight: 'none',
              resize: 'vertical'
            }}
          >
            <pre 
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: highlightJson(formattedJson) }}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-200/20 via-blue-400/20 to-blue-200/20 cursor-ns-resize opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
    </div>
  );
};

export default JsonDisplay;
