'use client';

import { createContext, useContext } from 'react';
import { ThemeContextType } from '../types/theme';

// Create the context with undefined as initial value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Export the context for the provider
export { ThemeContext };

// Hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 