'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../contexts/ThemeContext';

interface CodeBlockProps {
  language: string;
  code: string;
  codeIndex: number;
  copiedCode: number | null;
  onCopy: (text: string, index: number) => void;
}

export function CodeBlock({ language, code, codeIndex, copiedCode, onCopy }: CodeBlockProps) {
  const { theme } = useTheme();
  
  // Map common language aliases to their proper names for syntax highlighting
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'jsx',
    'tsx': 'tsx',
    'py': 'python',
    'rb': 'ruby',
    'go': 'go',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'php': 'php',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sh': 'bash',
    'bash': 'bash',
    'shell': 'bash',
    'sql': 'sql',
    'text': 'text',
    'plaintext': 'text',
    'txt': 'text'
  };
  
  const mappedLanguage = languageMap[language.toLowerCase()] || language;
  
  return (
    <div className="my-4 rounded overflow-hidden relative group">
      <div className="bg-gray-800 text-gray-400 text-xs px-3 py-1 flex justify-between items-center">
        <span className="font-mono">{mappedLanguage}</span>
        <button 
          onClick={() => onCopy(code, codeIndex)}
          className="ml-2 p-1 rounded transition-all duration-200 hover:bg-gray-700"
          title="Copy to clipboard"
        >
          {copiedCode === codeIndex ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          )}
        </button>
      </div>
      <SyntaxHighlighter 
        language={mappedLanguage}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          borderRadius: '0',
          fontSize: '0.9rem',
          lineHeight: '1.4',
          overflowX: 'auto'
        }}
        className="syntax-highlighter"
        showLineNumbers={code.split('\n').length > 3}
        wrapLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
} 