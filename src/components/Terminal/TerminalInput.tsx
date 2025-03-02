'use client';

import React, { useRef, useEffect } from 'react';

interface TerminalInputProps {
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function TerminalInput({ input, setInput, loading, onSubmit }: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when component mounts, but don't auto-scroll
  useEffect(() => {
    if (inputRef.current) {
      // Use setTimeout to delay focus to prevent unwanted scrolling
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus({preventScroll: true});
          
          // Clear any previous input value that might be cached by the browser
          if (input === '') {
            inputRef.current.value = '';
          }
        }
      }, 0);
    }
  }, [input]);
  
  // Force clear the input field on component mount
  useEffect(() => {
    if (inputRef.current) {
      // This ensures the input is empty on initial render
      inputRef.current.value = '';
      setInput('');
    }
  }, [setInput]);
  
  return (
    <div className="flex items-start mt-3">
      <div className="flex items-start w-full theme-command-bg py-1.5 px-2 rounded-md">
        <span className="theme-prompt mr-2 flex-shrink-0">user@dox:~$</span>
        <form onSubmit={onSubmit} className="w-full">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent outline-none border-none py-0.5 w-full font-mono text-base"
            placeholder={loading ? "Searching documentation..." : "Ask a programming question or type a command..."}
            autoComplete="off" // Prevent browser from suggesting previous inputs
          />
        </form>
      </div>
    </div>
  );
} 