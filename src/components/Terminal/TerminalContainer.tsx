'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { TerminalHistory } from './TerminalHistory';
import { TerminalInput } from './TerminalInput';
import { processCommand, HistoryItem } from '../../utils/commandProcessor';

interface TerminalContainerProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onNonCommandInput?: (commandText: string) => void;
}

export function TerminalContainer({ 
  history, 
  setHistory,
  input, 
  setInput, 
  loading, 
  onSubmit,
  onNonCommandInput
}: TerminalContainerProps) {
  const { theme, setTheme } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Auto-scroll to bottom when input changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [input]);
  
  // Force re-render when theme changes
  useEffect(() => {
    console.log('TerminalContainer: Theme changed to:', theme);
  }, [theme]);
  
  const handleTerminalClick = () => {
    // Don't focus input if user is selecting text
    const selection = window.getSelection();
    if (selection && selection.toString().length === 0) {
      // Find the input element and focus it
      const inputElement = terminalRef.current?.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  // Wrap the onSubmit handler to process commands first
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    console.log('TerminalContainer handleSubmit called with input:', input);
    
    // Add command to history first
    const currentInput = input;
    setHistory(prev => [...prev, { type: 'command', content: currentInput }]);
    
    // Clear input immediately
    setInput('');
    
    // Check if it's a built-in command
    console.log('Checking if input is a built-in command');
    const isBuiltInCommand = processCommand(currentInput, history, setHistory, theme, setTheme);
    console.log('Is built-in command?', isBuiltInCommand);
    
    if (isBuiltInCommand) {
      console.log('Built-in command processed, not calling parent onSubmit');
      return;
    }
    
    // If not a command and we have a non-command handler, use it
    if (onNonCommandInput) {
      console.log('Using onNonCommandInput handler');
      onNonCommandInput(currentInput);
      return;
    }
    
    // Fallback to the original onSubmit handler
    console.log('Falling back to onSubmit handler');
    onSubmit(e);
  };
  
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <style jsx global>{`
        /* Custom scrollbar styling */
        .terminal-container::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        .terminal-container::-webkit-scrollbar-track {
          background: transparent;
          margin: 6px;
        }
        
        .terminal-container::-webkit-scrollbar-thumb {
          background: var(--theme-scrollbar-thumb);
          border-radius: 10px;
          transition: background-color 0.3s ease;
          /* Add padding to prevent overlap with container corners */
          border: 3px solid #111827; /* Match terminal background */
          background-clip: padding-box;
        }
        
        .terminal-container::-webkit-scrollbar-thumb:hover {
          background: var(--theme-scrollbar-thumb);
        }
        
        .terminal-container::-webkit-scrollbar-thumb:active {
          background: var(--theme-scrollbar-thumb);
        }
        
        .terminal-container::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Firefox scrollbar styling */
        .terminal-container {
          scrollbar-width: thin;
          scrollbar-color: var(--theme-scrollbar-thumb) transparent;
        }
        
        /* Code block scrollbar styling */
        .syntax-highlighter::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        .syntax-highlighter::-webkit-scrollbar-track {
          background: transparent;
          margin: 6px;
        }
        
        .syntax-highlighter::-webkit-scrollbar-thumb {
          background: var(--theme-scrollbar-thumb);
          border-radius: 10px;
          transition: background-color 0.3s ease;
          /* Add padding to prevent overlap with container corners */
          border: 3px solid #1e293b; /* Match code block background */
          background-clip: padding-box;
        }
        
        .syntax-highlighter::-webkit-scrollbar-thumb:hover {
          background: var(--theme-scrollbar-thumb);
        }
        
        .syntax-highlighter::-webkit-scrollbar-thumb:active {
          background: var(--theme-scrollbar-thumb);
        }
        
        .syntax-highlighter::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        .syntax-highlighter {
          scrollbar-width: thin;
          scrollbar-color: var(--theme-scrollbar-thumb) transparent;
        }
        
        /* Custom caret styling */
        input {
          caret-color: var(--theme-text);
          color: white;
        }
        
        /* Placeholder styling */
        input::placeholder {
          color: var(--theme-text);
          opacity: 0.7;
        }
      `}</style>
      <div 
        ref={terminalRef}
        className="terminal-container flex-1 overflow-auto p-2 sm:p-3 bg-gray-900 rounded-lg border border-gray-700"
        onClick={handleTerminalClick}
      >
        <TerminalHistory history={history} />
        
        {/* Input field inside terminal */}
        <TerminalInput 
          input={input}
          setInput={setInput}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 