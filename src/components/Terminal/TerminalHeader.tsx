'use client';

import React from 'react';
import Image from 'next/image';

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
        <span className="theme-prompt mr-1">●</span> 
        DOX CLI v1.0.0
      </div>
    </div>
  );
} 