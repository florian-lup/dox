'use client';

import React from 'react';

interface TerminalFooterProps {
  loading: boolean;
  onCancelRequest?: () => void;
}

export function TerminalFooter({ loading, onCancelRequest }: TerminalFooterProps) {
  return (
    <div className="mt-1 sm:mt-2 text-xs text-gray-500 flex justify-between items-center px-1 flex-wrap gap-1">
      <div className="text-xs"><span>Type </span><span className="theme-prompt">help</span><span> for commands</span></div>
      <div className="flex items-center">
        {loading ? (
          <>
            <span>Processing...</span>
            {onCancelRequest && (
              <button 
                onClick={onCancelRequest}
                className="ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 rounded bg-red-700 hover:bg-red-600 text-white transition-colors text-xs"
                aria-label="Cancel request"
              >
                Cancel
              </button>
            )}
          </>
        ) : (
          <span className="text-xs">Ready</span>
        )}
      </div>
    </div>
  );
} 