'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface TerminalFooterProps {
  loading: boolean;
}

export function TerminalFooter({ loading }: TerminalFooterProps) {
  const { theme } = useTheme();
  
  return (
    <div className="mt-2 text-xs text-gray-500 flex justify-between items-center px-1">
      <div>Type <span className="theme-prompt">help</span> for available commands</div>
      <div>{loading ? 'Searching documentation...' : 'Ready'}</div>
    </div>
  );
} 