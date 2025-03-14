'use client';

import { useState, useRef } from 'react';
import { HistoryItem } from '../types/terminal';

export function useTerminalHistory(initialHistory: HistoryItem[] = []) {
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const historyRef = useRef<HTMLDivElement>(null);

  // Function to add a command to history
  const addCommandToHistory = (command: string) => {
    setHistory(prev => [...prev, { type: 'command', content: command }]);
  };

  // Function to add a response to history
  const addResponseToHistory = (content: string) => {
    setHistory(prev => [...prev, { type: 'response', content }]);
  };

  // Function to add an error to history
  const addErrorToHistory = (error: string) => {
    setHistory(prev => [...prev, { type: 'error', content: error }]);
  };

  // Function to clear history
  const clearHistory = () => {
    setHistory([{ type: 'response', content: 'Terminal cleared. Ready for your next question or command.' }]);
  };

  // Scroll to bottom when history changes
  const scrollToBottom = () => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  };

  return {
    history,
    setHistory,
    historyRef,
    addCommandToHistory,
    addResponseToHistory,
    addErrorToHistory,
    clearHistory,
    scrollToBottom
  };
} 