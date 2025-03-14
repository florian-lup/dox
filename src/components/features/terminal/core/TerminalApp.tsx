'use client';

import { useState, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme, HistoryItem } from '../../../../lib';
import { 
  TerminalContainer 
} from './';
import {
  TerminalHeader,
  TerminalFooter
} from '../ui';

// Create a wrapper component that has access to the theme context
function TerminalAppContent() {
  // Include theme in the destructuring to ensure component re-renders when theme changes
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'response', content: 'Welcome to DOX CLI v1.0.0 - Your intelligent documentation assistant.\nType `help` to see available commands or ask any programming question to get started.' }
  ]);
  
  // Add AbortController reference to handle API cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Force re-render when theme changes
  useEffect(() => {
    console.log('TerminalApp: Theme changed to:', theme);
  }, [theme]);

  // Function to cancel ongoing API request
  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Request cancelled by user');
      abortControllerRef.current = null;
      
      // Add cancellation message without removing any previous messages
      setHistory(prev => [...prev, { type: 'error', content: 'Request cancelled by user.' }]);
      
      // Reset loading state
      setLoading(false);
    }
  };

  // This function will be called directly with the command text
  const handleNonCommandInput = async (commandText: string) => {
    console.log('handleNonCommandInput called with:', commandText);
    
    // Start loading
    setLoading(true);

    try {
      // Remove the "thinking" message - we don't want to show it anymore
      // setHistory(prev => [...prev, { type: 'response', content: 'Analyzing your question and searching documentation resources...' }]);
      
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      console.log('Sending API request to /api/langchain');
      const response = await fetch('/api/langchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: commandText }),
        signal, // Pass the abort signal to fetch
      });

      console.log('API response received:', response.status);
      const data = await response.json();
      console.log('API data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get explanation');
      }

      // Since we're not adding a "thinking" message anymore, we just add the response
      setHistory(prev => [...prev, { type: 'response', content: data.explanation }]);
    } catch (err) {
      console.error('API request error:', err);
      
      // Don't show error message if it was cancelled (AbortError)
      if (err instanceof Error && err.name !== 'AbortError') {
        const errorMessage = err.message || 'An error occurred';
        setHistory(prev => [...prev, { type: 'error', content: `Error: ${errorMessage}` }]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
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
      <TerminalFooter 
        loading={loading} 
        onCancelRequest={handleCancelRequest} 
      />
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