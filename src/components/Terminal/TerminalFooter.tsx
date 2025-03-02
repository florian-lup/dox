'use client';

import React from 'react';

interface TerminalFooterProps {
  loading: boolean;
  onCancelRequest?: () => void;
}

export function TerminalFooter({ loading, onCancelRequest }: TerminalFooterProps) {
  return (
    <div className="mt-2 text-xs text-gray-500 flex justify-between items-center px-1">
      <div>Type <span className="theme-prompt">help</span> for available commands</div>
      <div className="flex items-center">
        {loading ? (
          <>
            <span>Searching documentation...</span>
            {onCancelRequest && (
              <button 
                onClick={onCancelRequest}
                className="ml-2 px-2 py-0.5 rounded bg-red-700 hover:bg-red-600 text-white transition-colors"
                aria-label="Cancel request"
              >
                Cancel
              </button>
            )}
          </>
        ) : (
          <span>Ready</span>
        )}
      </div>
    </div>
  );
} 