'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { TerminalHeader } from './Terminal/TerminalHeader';
import { TerminalContainer } from './Terminal/TerminalContainer';
import { TerminalFooter } from './Terminal/TerminalFooter';
import { HistoryItem } from '../utils/commandProcessor';

// Create a wrapper component that has access to the theme context
function TerminalAppContent() {
  // Include theme in the destructuring to ensure component re-renders when theme changes
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'response', content: 'Welcome to DOX CLI v1.0.0 - Your intelligent documentation assistant.\nType `help` to see available commands or ask any programming question to get started.' }
  ]);

  // Force re-render when theme changes
  useEffect(() => {
    console.log('TerminalApp: Theme changed to:', theme);
  }, [theme]);

  // This function will be called directly with the command text
  const handleNonCommandInput = async (commandText: string) => {
    console.log('handleNonCommandInput called with:', commandText);
    
    // Start loading
    setLoading(true);

    try {
      // Add "thinking" message
      setHistory(prev => [...prev, { type: 'response', content: 'Analyzing your question and searching documentation resources...' }]);
      
      console.log('Sending API request to /api/langchain');
      const response = await fetch('/api/langchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: commandText }),
      });

      console.log('API response received:', response.status);
      const data = await response.json();
      console.log('API data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get explanation');
      }

      // Remove the "thinking" message and add the actual response
      setHistory(prev => [
        ...prev.slice(0, prev.length - 1), 
        { type: 'response', content: data.explanation }
      ]);
    } catch (err) {
      console.error('API request error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setHistory(prev => [
        ...prev.slice(0, prev.length - 1),
        { type: 'error', content: `Error: ${errorMessage}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // This is the form submit handler that will be passed to TerminalContainer
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('TerminalApp handleSubmit called - this should not be reached directly');
    // The actual processing is done in handleNonCommandInput which is called from TerminalContainer
  };

  return (
    <div className="h-screen bg-black p-2 sm:p-4 font-mono flex flex-col overflow-hidden" style={{ color: 'var(--theme-text)' }}>
      <TerminalHeader />
      <TerminalContainer 
        history={history}
        setHistory={setHistory}
        input={input}
        setInput={setInput}
        loading={loading}
        onSubmit={handleSubmit}
        onNonCommandInput={handleNonCommandInput}
      />
      <TerminalFooter loading={loading} />
    </div>
  );
}

// Main component that provides the theme context
export default function TerminalApp() {
  return (
    <ThemeProvider>
      <TerminalAppContent />
    </ThemeProvider>
  );
} 