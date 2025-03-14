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
    <div className="flex items-center mt-2 sm:mt-3">
      <div className="flex items-center w-full py-1 sm:py-1.5 px-1 sm:px-2 rounded-md bg-gray-100 dark:bg-gray-800">
        <span className="text-purple-600 dark:text-purple-400 mr-1 sm:mr-2 flex-shrink-0 font-mono text-xs sm:text-sm md:text-base flex items-center">
          <span>user@dox:~$</span>
        </span>
        <form onSubmit={onSubmit} className="w-full flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent outline-none border-none py-0.5 w-full font-mono text-xs sm:text-sm md:text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:text-left"
            placeholder={loading ? "Searching documentation..." : "Ask a question or type a command..."}
            autoComplete="off" // Prevent browser from suggesting previous inputs
            style={{ caretColor: 'currentColor' }} // Ensure cursor color matches text color
          />
        </form>
      </div>
    </div>
  );
} 