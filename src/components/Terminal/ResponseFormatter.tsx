'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CodeBlock } from './CodeBlock';

interface ResponseFormatterProps {
  content: string;
}

export function ResponseFormatter({ content }: ResponseFormatterProps) {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  
  // Copy code to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    
    // Reset copied state after timeout
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };
  
  // Split content by code blocks - handle both ``` and ``` with language
  const parts = content.split(/```(\w*)\n?([\s\S]*?)```/g);
  
  if (parts.length === 1) {
    // No code blocks, return formatted text
    return <MarkdownRenderer content={content} />;
  }
  
  const formattedParts = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      // Regular text part
      if (parts[i].trim()) {
        formattedParts.push(
          <div key={`text-${i}`} className="mb-2">
            <MarkdownRenderer content={parts[i]} />
          </div>
        );
      }
    } else if (i % 3 === 1) {
      // Language identifier (if any)
      continue;
    } else {
      // Code block
      const language = parts[i-1] || 'javascript';
      const codeContent = parts[i].trim();
      const codeIndex = i;
      
      formattedParts.push(
        <CodeBlock 
          key={`code-${i}`}
          language={language}
          code={codeContent}
          codeIndex={codeIndex}
          copiedCode={copiedCode}
          onCopy={copyToClipboard}
        />
      );
    }
  }
  
  return <>{formattedParts}</>;
} 