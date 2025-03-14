'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Removing the unused theme variable
  
  // Split by lines
  const lines = content.split('\n');
  
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  
  // Function to process text formatting (bold, italic, inline code, strikethrough)
  const processTextFormatting = (text: string) => {
    // Process bold text (**text**)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process italic text (*text*)
    formattedText = formattedText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    // Process inline code (`text`)
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Process strikethrough (~~text~~)
    formattedText = formattedText.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Process links in format [text](url)
    formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="theme-link hover:underline">${text}</a>`;
    });
    
    // Return text with HTML tags
    if (formattedText !== text) {
      return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
    }
    
    // Return plain text if no formatting
    return text;
  };
  
  // Process horizontal rule
  const processHorizontalRule = (line: string) => {
    return line.match(/^(\s*[-*_]){3,}\s*$/) !== null;
  };
  
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        // Check if line is a heading (starts with # or ##)
        if (line.match(/^#+\s/)) {
          const headingLevel = line.match(/^(#+)\s/)?.[1].length || 1;
          const headingText = line.replace(/^#+\s/, '');
          
          const headingClasses = [
            "font-bold text-white", 
            headingLevel === 1 ? "text-lg mt-4 mb-2" : 
            headingLevel === 2 ? "text-base mt-3 mb-1" : "mt-2"
          ].join(' ');
          
          return (
            <div key={idx} className={headingClasses}>
              {processTextFormatting(headingText)}
            </div>
          );
        }
        
        // Check if line is a horizontal rule
        if (processHorizontalRule(line)) {
          return <hr key={idx} className="my-3 border-gray-700" />;
        }
        
        // Check if line is a bullet point and determine indentation level
        // Enhanced regex to catch more bullet point formats including standalone • characters
        const bulletMatch = line.match(/^(\s*)([-*•]|\d+\.)\s*(.*)/);
        if (bulletMatch) {
          const [, indent, bulletType, content] = bulletMatch;
          const indentLevel = Math.floor(indent.length / 2);
          const indentClass = `ml-${Math.min(4 + indentLevel * 4, 16)}`; // Cap the indentation level
          
          // Handle empty bullet points (just the bullet character)
          if (!content && bulletType === '•') {
            return (
              <div key={idx} className={`flex ${indentClass} mb-1`}>
                <span className="mr-3">•</span>
                <span></span>
              </div>
            );
          }
          
          // Process links in bullet points
          const parts = content.split(urlPattern);
          
          // Determine bullet display (• for all bullet types, or the number for numbered lists)
          const bulletDisplay = bulletType.match(/\d+\./) ? bulletType : '•';
          
          return (
            <div key={idx} className={`flex ${indentClass} mb-1`}>
              <span className="mr-3 flex-shrink-0">{bulletDisplay}</span>
              <span className="flex-1">
                {parts.map((part, partIdx) => {
                  if (part.match(urlPattern)) {
                    return (
                      <a 
                        key={`${idx}-link-${partIdx}`}
                        href={part} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="theme-link hover:underline"
                      >
                        {part}
                      </a>
                    );
                  }
                  return <span key={`${idx}-text-${partIdx}`}>{processTextFormatting(part)}</span>;
                })}
              </span>
            </div>
          );
        }
        
        // Check if line is a blockquote (starts with >)
        const quoteMatch = line.match(/^(\s*)>\s*(.*)/);
        if (quoteMatch) {
          const [, indent, content] = quoteMatch;
          const indentLevel = Math.floor(indent.length / 2);
          const indentClass = `ml-${indentLevel * 4}`;
          
          return (
            <div key={idx} className={`${indentClass} pl-4 border-l-4 border-gray-600 italic text-gray-300 my-2`}>
              {processTextFormatting(content)}
            </div>
          );
        }
        
        // Check if line is empty
        if (!line.trim()) {
          return <div key={idx} className="h-2"></div>;
        }
        
        // Process links in regular text
        const parts = line.split(urlPattern);
        
        // Regular line
        return (
          <div key={idx}>
            {parts.map((part, partIdx) => {
              if (part.match(urlPattern)) {
                return (
                  <a 
                    key={`${idx}-link-${partIdx}`}
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="theme-link hover:underline"
                  >
                    {part}
                  </a>
                );
              }
              return <span key={`${idx}-text-${partIdx}`}>{processTextFormatting(part)}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
} 