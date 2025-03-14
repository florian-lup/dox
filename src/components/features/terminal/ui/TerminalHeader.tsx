'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function TerminalHeader() {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center">
          <Image 
            src="/logo.svg" 
            alt="DOX Logo" 
            width={20} 
            height={20} 
            className="filter brightness-150"
          />
        </div>
        <div className="ml-3 text-gray-400 text-sm flex items-center">
          <span className="hidden sm:inline">dox@terminal:</span>
          <span className="sm:hidden">dox:</span>
          <span className="text-gray-300 ml-1">~/documentation</span>
        </div>
      </div>
      <div className="text-gray-500 text-xs hidden sm:flex items-center">
        <Link 
          href="https://github.com/florian-lup/dox" 
          target="_blank" 
          rel="noopener noreferrer"
          className="theme-prompt mr-1 hover:opacity-80 transition-opacity"
          title="View on GitHub"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </Link>
        DOX CLI v1.0.0
      </div>
    </div>
  );
} 