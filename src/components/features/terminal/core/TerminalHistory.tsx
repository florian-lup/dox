'use client';

import React from 'react';
import { ResponseFormatter } from '../renderers/ResponseFormatter';
import { HistoryItem } from '../../../../lib/types/terminal';

interface TerminalHistoryProps {
  history: HistoryItem[];
}

export function TerminalHistory({ history }: TerminalHistoryProps) {
  return (
    <>
      {history.map((item, index) => (
        <div key={index} className="mb-2 sm:mb-3 md:mb-4 last:mb-1 sm:last:mb-2 text-xs sm:text-sm md:text-base">
          {item.type === 'command' && (
            <div className="flex items-center theme-command-bg py-1 sm:py-1.5 px-1 sm:px-2 rounded-md">
              <span className="theme-prompt mr-1 sm:mr-2 flex-shrink-0 flex items-center">
                <span>user@dox:~$</span>
              </span> 
              <span className="text-white break-words">{item.content}</span>
            </div>
          )}
          {item.type === 'response' && (
            <div className="theme-response pl-2 sm:pl-3 md:pl-4 border-l-2 border-gray-700">
              <ResponseFormatter content={item.content} />
            </div>
          )}
          {item.type === 'error' && (
            <div className="text-red-400 pl-2 sm:pl-3 md:pl-4 border-l-2 border-red-700">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </>
  );
} 