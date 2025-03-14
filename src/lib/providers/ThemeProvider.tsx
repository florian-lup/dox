'use client';

import { ReactNode, useState, useEffect } from 'react';
import { ThemeType, ThemeColors } from '../types/theme';
import { ThemeContext } from '../hooks/useTheme';

// Define theme colors using RGB values for direct CSS variable use
const themeColors: Record<ThemeType, ThemeColors> = {
  green: {
    text: 'rgb(74, 222, 128)',
    bg: 'rgb(17, 24, 39)',
    prompt: 'rgb(74, 222, 128)',
    response: 'rgb(74, 222, 128)',
    highlight: 'rgba(22, 101, 52, 0.3)',
    link: 'rgb(134, 239, 172)',
    scrollbarThumb: 'rgba(74, 222, 128, 0.5)',
    commandBg: 'rgba(22, 101, 52, 0.15)',
  },
  blue: {
    text: 'rgb(96, 165, 250)',
    bg: 'rgb(17, 24, 39)',
    prompt: 'rgb(96, 165, 250)',
    response: 'rgb(147, 197, 253)',
    highlight: 'rgba(30, 58, 138, 0.3)',
    link: 'rgb(147, 197, 253)',
    scrollbarThumb: 'rgba(96, 165, 250, 0.5)',
    commandBg: 'rgba(30, 58, 138, 0.15)',
  },
  amber: {
    text: 'rgb(251, 191, 36)',
    bg: 'rgb(17, 24, 39)',
    prompt: 'rgb(251, 191, 36)',
    response: 'rgb(252, 211, 77)',
    highlight: 'rgba(146, 64, 14, 0.3)',
    link: 'rgb(252, 211, 77)',
    scrollbarThumb: 'rgba(251, 191, 36, 0.5)',
    commandBg: 'rgba(146, 64, 14, 0.15)',
  },
};

// Function to apply theme colors to CSS variables
function applyThemeColors(theme: ThemeType) {
  const colors = themeColors[theme];
  
  // Apply CSS variables to document root
  document.documentElement.style.setProperty('--theme-text', colors.text);
  document.documentElement.style.setProperty('--theme-bg', colors.bg);
  document.documentElement.style.setProperty('--theme-prompt', colors.prompt);
  document.documentElement.style.setProperty('--theme-response', colors.response);
  document.documentElement.style.setProperty('--theme-highlight', colors.highlight);
  document.documentElement.style.setProperty('--theme-link', colors.link);
  document.documentElement.style.setProperty('--theme-scrollbar-thumb', colors.scrollbarThumb);
  document.documentElement.style.setProperty('--theme-command-bg', colors.commandBg);
  
  console.log('Theme applied:', theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('green');
  
  // Apply theme colors when theme changes
  useEffect(() => {
    applyThemeColors(theme);
    
    // Force a repaint by adding and removing a class
    document.body.classList.add('theme-updated');
    setTimeout(() => {
      document.body.classList.remove('theme-updated');
    }, 0);
  }, [theme]);
  
  // Apply initial theme colors on first render - always green
  useEffect(() => {
    // Always apply green theme initially
    applyThemeColors('green');
    
    // Note: We're no longer checking localStorage for initial theme
    // This ensures we always start with green regardless of saved preferences
  }, []);
  
  // Save theme preference to localStorage when it changes
  // This still allows users to change themes during their session
  useEffect(() => {
    try {
      localStorage.setItem('terminal-theme', theme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 