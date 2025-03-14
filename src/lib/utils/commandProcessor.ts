import { ThemeType } from '../types/theme';
import { HistoryItem } from '../types/terminal';
import React from 'react';

export function processCommand(
  command: string,
  history: HistoryItem[],
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>,
  theme: ThemeType,
  setTheme: (theme: ThemeType) => void
): boolean {
  const cmd = command.trim().toLowerCase();
  const commandParts = cmd.split(' ');
  
  // Handle built-in commands
  if (cmd === 'clear') {
    setHistory([{ type: 'response', content: 'Terminal cleared. Ready for your next question or command.' }]);
    return true;
  } else if (cmd === 'help') {
    setHistory(prev => [...prev, { 
      type: 'response', 
      content: '# Available Commands\n\n' +
               '• help     - Display all available commands and their usage\n' +
               '• clear    - Reset the terminal to its initial state\n' +
               '• history  - View a list of your previously executed commands\n' +
               '• theme    - Customize the terminal appearance with different color schemes\n' +
               '• version  - Display the current DOX CLI version information\n' +
               '• about    - Learn more about DOX CLI and its capabilities\n\n' +
               'For programming assistance, simply type your question directly.'
    }]);
    return true;
  } else if (cmd === 'history') {
    // Filter out the current command which was just added
    const commandHistory = history
      .filter(item => item.type === 'command')
      .slice(0, -1) // Remove the 'history' command itself
      .map(item => item.content);
    
    if (commandHistory.length === 0) {
      setHistory(prev => [...prev, { type: 'response', content: 'No command history yet.' }]);
    } else {
      setHistory(prev => [...prev, { 
        type: 'response', 
        content: '# Command History\n\n' + 
                 commandHistory.map((cmd) => `• ${cmd}`).join('\n')
      }]);
    }
    return true;
  } else if (commandParts[0] === 'theme') {
    if (commandParts.length === 1) {
      // Show available themes if no theme specified
      setHistory(prev => [...prev, { 
        type: 'response', 
        content: '# Available Themes\n\n' +
                 '• green - Classic terminal theme with vibrant green text\n' +
                 '• blue  - Modern theme with calming blue accents\n' +
                 '• amber - Retro-inspired theme with warm amber glow\n\n' +
                 `Current theme: ${theme}\n\n` +
                 'To apply a new theme, use: theme [color]'
      }]);
      return true;
    } else {
      // Set theme if specified
      const requestedTheme = commandParts[1];
      if (['green', 'blue', 'amber'].includes(requestedTheme)) {
        // Apply the theme change immediately
        setTheme(requestedTheme as ThemeType);
        
        // Add response to history after a small delay to ensure theme is applied first
        setTimeout(() => {
          setHistory(prev => [...prev, { 
            type: 'response', 
            content: `Theme changed to ${requestedTheme}.`
          }]);
        }, 50);
        
        return true;
      } else {
        setHistory(prev => [...prev, { 
          type: 'error', 
          content: `Invalid theme: ${requestedTheme}. Available themes: green, blue, amber.`
        }]);
        return true;
      }
    }
  } else if (cmd === 'version') {
    setHistory(prev => [...prev, { 
      type: 'response', 
      content: 'DOX CLI v1.0.0 - Documentation Assistant\nRunning on Next.js and React'
    }]);
    return true;
  } else if (cmd === 'about') {
    setHistory(prev => [...prev, { 
      type: 'response', 
      content: '# DOX CLI - Documentation Assistant\n\n' +
               '• Created by: Florian Lup\n' +
               '• Description: A powerful AI-powered documentation assistant designed to provide answers to your programming questions.\n' +
               '• Technology: Built with Next.js, React, TypeScript, and LangChain.\n' +
               '• GitHub: https://github.com/florian-lup/dox\n\n' +
               'Copyright © ' + new Date().getFullYear()
    }]);
    return true;
  }
  
  return false;
} 