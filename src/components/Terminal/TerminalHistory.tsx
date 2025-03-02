'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ResponseFormatter } from './ResponseFormatter';
import { HistoryItem } from '../../utils/commandProcessor';

interface TerminalHistoryProps {
  history: HistoryItem[];
}

export function TerminalHistory({ history }: TerminalHistoryProps) {
  return (
    <>
      {history.map((item, index) => (
        <div key={index} className="mb-4 last:mb-2">
          {item.type === 'command' && (
            <div className="flex items-start theme-command-bg py-1.5 px-2 rounded-md">
              <span className="theme-prompt mr-2 flex-shrink-0">user@dox:~$ </span> 
              <span className="text-white break-words">{item.content}</span>
            </div>
          )}
          {item.type === 'response' && (
            <div className="theme-response pl-3 sm:pl-4 border-l-2 border-gray-700">
              <ResponseFormatter content={item.content} />
            </div>
          )}
          {item.type === 'error' && (
            <div className="text-red-400 pl-3 sm:pl-4 border-l-2 border-red-700">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </>
  );
} 