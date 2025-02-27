'use client';

import { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type ThemeType = 'green' | 'blue' | 'amber';

interface HistoryItem {
    type: 'command' | 'response' | 'error';
    content: string;
}

export default function DocumentationAssistant() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState<ThemeType>('green');
    const [copiedCode, setCopiedCode] = useState<number | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([
        { type: 'response', content: 'Welcome to DOX CLI v1.0.0 - Documentation Assistant\nType your programming question and press Enter.\nType "help" to see available commands.' }
    ]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when history changes
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input when component mounts or when clicking on terminal
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Reset copied state after timeout
    useEffect(() => {
        if (copiedCode !== null) {
            const timer = setTimeout(() => {
                setCopiedCode(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copiedCode]);

    const getThemeClasses = () => {
        switch (theme) {
            case 'blue':
                return {
                    text: 'text-blue-400',
                    bg: 'bg-gray-900',
                    prompt: 'text-cyan-400',
                    response: 'text-blue-300',
                    highlight: 'bg-blue-900/30',
                    link: 'text-blue-300 underline hover:text-blue-200'
                };
            case 'amber':
                return {
                    text: 'text-amber-400',
                    bg: 'bg-gray-900',
                    prompt: 'text-yellow-400',
                    response: 'text-amber-300',
                    highlight: 'bg-amber-900/30',
                    link: 'text-amber-300 underline hover:text-amber-200'
                };
            case 'green':
            default:
                return {
                    text: 'text-green-400',
                    bg: 'bg-gray-900',
                    prompt: 'text-blue-400',
                    response: 'text-green-400',
                    highlight: 'bg-green-900/30',
                    link: 'text-green-300 underline hover:text-green-200'
                };
        }
    };

    const themeClasses = getThemeClasses();

    // Copy code to clipboard
    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(index);
    };

    // Format response with code highlighting
    const formatResponse = (content: string) => {
        // Split content by code blocks - handle both ``` and ``` with language
        const parts = content.split(/```(\w*)\n?([\s\S]*?)```/g);
        
        if (parts.length === 1) {
            // No code blocks, return formatted text
            return formatTextWithBullets(content);
        }
        
        const formattedParts = [];
        for (let i = 0; i < parts.length; i++) {
            if (i % 3 === 0) {
                // Regular text part
                if (parts[i].trim()) {
                    formattedParts.push(formatTextWithBullets(parts[i]));
                }
            } else if (i % 3 === 1) {
                // Language identifier (if any)
                continue;
            } else {
                // Code block
                const language = parts[i-1] || 'javascript';
                const codeContent = parts[i].trim();
                const codeIndex = i;
                
                formattedParts.push(
                    <div key={i} className="my-3 rounded overflow-hidden relative group">
                        <div className="bg-gray-800 text-gray-400 text-xs px-3 py-1 flex justify-between items-center">
                            <span>{language}</span>
                            <button 
                                onClick={() => copyToClipboard(codeContent, codeIndex)}
                                className="ml-2 p-1 rounded transition-all duration-200 hover:bg-gray-700"
                            >
                                {copiedCode === codeIndex ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <SyntaxHighlighter 
                            language={language} 
                            style={atomDark}
                            customStyle={{
                                margin: 0,
                                padding: '0.75rem',
                                borderRadius: '0',
                                fontSize: '0.9rem',
                            }}
                        >
                            {codeContent}
                        </SyntaxHighlighter>
                    </div>
                );
            }
        }
        
        return <>{formattedParts}</>;
    };
    
    // Format text with bullet points, highlights, and links
    const formatTextWithBullets = (text: string) => {
        // Split by lines
        const lines = text.split('\n');
        
        // URL regex pattern
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        
        return (
            <div className="space-y-1">
                {lines.map((line, idx) => {
                    // Check if line is a heading (starts with # or ##)
                    if (line.match(/^#+\s/)) {
                        const headingLevel = line.match(/^(#+)\s/)?.[1].length || 1;
                        const headingText = line.replace(/^#+\s/, '');
                        
                        const headingClasses = [
                            "font-bold text-white", 
                            headingLevel === 1 ? "text-lg mt-3" : "mt-2"
                        ].join(' ');
                        
                        return (
                            <div key={idx} className={headingClasses}>
                                {headingText}
                            </div>
                        );
                    }
                    
                    // Check if line is a bullet point and determine indentation level
                    const bulletMatch = line.match(/^(\s*)[-*•]\s(.*)/);
                    if (bulletMatch) {
                        const [, indent, content] = bulletMatch;
                        const indentLevel = Math.floor(indent.length / 2);
                        const indentClass = `ml-${4 + indentLevel * 4}`;
                        
                        // Process links in bullet points
                        const parts = content.split(urlPattern);
                        
                        return (
                            <div key={idx} className={`flex ${indentClass}`}>
                                <span className="mr-3">•</span>
                                <span>
                                    {parts.map((part, partIdx) => {
                                        if (part.match(urlPattern)) {
                                            return (
                                                <a 
                                                    key={`${idx}-link-${partIdx}`}
                                                    href={part} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={themeClasses.link}
                                                >
                                                    {part}
                                                </a>
                                            );
                                        }
                                        return <span key={`${idx}-text-${partIdx}`}>{part}</span>;
                                    })}
                                </span>
                            </div>
                        );
                    }
                    
                    // Check if line is empty
                    if (!line.trim()) {
                        return <div key={idx} className="h-2"></div>;
                    }
                    
                    // Process links in regular text
                    const parts = line.split(urlPattern);
                    
                    // Regular line
                    return (
                        <div key={idx}>
                            {parts.map((part, partIdx) => {
                                if (part.match(urlPattern)) {
                                    return (
                                        <a 
                                            key={`${idx}-link-${partIdx}`}
                                            href={part} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={themeClasses.link}
                                        >
                                            {part}
                                        </a>
                                    );
                                }
                                return <span key={`${idx}-text-${partIdx}`}>{part}</span>;
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    const handleCommand = (cmd: string) => {
        const command = cmd.trim().toLowerCase();
        
        // Handle built-in commands
        if (command === 'clear') {
            setHistory([{ type: 'response', content: 'Terminal cleared. What would you like to know?' }]);
            return true;
        } else if (command === 'help') {
            setHistory(prev => [...prev, { 
                type: 'response', 
                content: '# Available Commands\n\n' +
                         '• help     - Show this help message\n' +
                         '• clear    - Clear the terminal\n' +
                         '• history  - Show command history\n' +
                         '• theme    - Toggle between color themes\n' +
                         '• version  - Show current version\n' +
                         '• about    - Show information about DOX CLI\n\n' +
                         'Any other input will be treated as a programming question.'
            }]);
            return true;
        } else if (command === 'history') {
            const commandHistory = history
                .filter(item => item.type === 'command')
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
        } else if (command === 'theme') {
            const nextTheme: ThemeType = theme === 'green' ? 'blue' : theme === 'blue' ? 'amber' : 'green';
            setTheme(nextTheme);
            setHistory(prev => [...prev, { 
                type: 'response', 
                content: `Theme changed to ${nextTheme}.`
            }]);
            return true;
        } else if (command === 'version') {
            setHistory(prev => [...prev, { 
                type: 'response', 
                content: 'DOX CLI v1.0.0'
            }]);
            return true;
        } else if (command === 'about') {
            setHistory(prev => [...prev, { 
                type: 'response', 
                content: '# DOX CLI - Documentation Assistant\n\n' +
                         '• Version: 1.0.0\n' +
                         '• Created by: Your Name\n' +
                         '• Description: An AI-powered documentation assistant that helps answer programming questions.\n' +
                         '• Built with: Next.js, React, TypeScript, and LangChain\n\n' +
                         'Copyright © ' + new Date().getFullYear()
            }]);
            return true;
        }
        
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!input.trim()) return;
        
        // Add command to history
        const currentInput = input;
        setHistory(prev => [...prev, { type: 'command', content: currentInput }]);
        
        // Clear input immediately
        setInput('');
        
        // Check if it's a built-in command
        if (handleCommand(currentInput)) {
            return;
        }
        
        // Start loading
        setLoading(true);
        
        try {
            // Add "thinking" message
            setHistory(prev => [...prev, { type: 'response', content: 'Processing query...' }]);
            
            const response = await fetch('/api/langchain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: currentInput }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get explanation');
            }

            // Remove the "thinking" message and add the actual response
            setHistory(prev => [
                ...prev.slice(0, prev.length - 1), 
                { type: 'response', content: data.explanation }
            ]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setHistory(prev => [
                ...prev.slice(0, prev.length - 1),
                { type: 'error', content: `Error: ${errorMessage}` }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className={`min-h-screen bg-black ${themeClasses.text} p-4 font-mono flex flex-col`}>
            <div className="mb-2 flex items-center">
                <div className="flex items-center">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 text-gray-400 text-sm">dox@terminal: ~/documentation</div>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col relative">
                <div 
                    ref={terminalRef}
                    className={`flex-1 overflow-auto mb-4 p-2 ${themeClasses.bg} rounded-t border border-gray-700`}
                    onClick={handleTerminalClick}
                >
                    {history.map((item, index) => (
                        <div key={index} className="mb-4 last:mb-2">
                            {item.type === 'command' && (
                                <div className="flex items-start">
                                    <span className={`${themeClasses.prompt} mr-2`}>user@dox:~$ </span> 
                                    <span className="text-white">{item.content}</span>
                                </div>
                            )}
                            {item.type === 'response' && (
                                <div className={`${themeClasses.response} pl-4 border-l-2 border-gray-700`}>
                                    {formatResponse(item.content)}
                                </div>
                            )}
                            {item.type === 'error' && (
                                <div className="text-red-400 pl-4 border-l-2 border-red-700">
                                    {item.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className={`sticky bottom-0 p-2 ${themeClasses.bg} border border-gray-700 rounded-b`}>
                    <form onSubmit={handleSubmit} className="flex items-center">
                        <span className={themeClasses.prompt}>user@dox:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            className="flex-1 bg-transparent text-white outline-none border-none ml-2"
                            placeholder={loading ? "Processing..." : "Type your question..."}
                            autoFocus
                        />
                        <span className="animate-pulse text-white">▌</span>
                    </form>
                </div>
            </div>
        </div>
    );
} 