'use client';

import { useState } from 'react';
import { HistoryItem } from '../types/terminal';
import { processCommand } from '../utils/commandProcessor';
import { useTheme } from './useTheme';

export function useCommandProcessor() {
  const { theme, setTheme } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([
    { 
      type: 'response', 
      content: 'Welcome to DOX CLI v1.0.0 - Your intelligent documentation assistant.\nType `help` to see available commands or ask any programming question to get started.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle command submission
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add command to history first
    const currentInput = input;
    setHistory(prev => [...prev, { type: 'command', content: currentInput }]);
    
    // Clear input immediately
    setInput('');
    
    // Check if it's a built-in command
    const isBuiltInCommand = processCommand(currentInput, history, setHistory, theme, setTheme);
    
    return isBuiltInCommand;
  };

  return {
    history,
    setHistory,
    input,
    setInput,
    loading,
    setLoading,
    handleCommandSubmit
  };
} 