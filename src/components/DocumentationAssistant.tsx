'use client';

import { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

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
    
    // Auto-scroll to bottom when input changes
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [input]);

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
                    formattedParts.push(
                        <div key={`text-${i}`} className="mb-2">
                            {formatTextWithBullets(parts[i])}
                        </div>
                    );
                }
            } else if (i % 3 === 1) {
                // Language identifier (if any)
                continue;
            } else {
                // Code block
                const language = parts[i-1] || 'javascript';
                const codeContent = parts[i].trim();
                const codeIndex = i;
                
                // Map common language aliases to their proper names for syntax highlighting
                const languageMap: Record<string, string> = {
                    'js': 'javascript',
                    'ts': 'typescript',
                    'jsx': 'jsx',
                    'tsx': 'tsx',
                    'py': 'python',
                    'rb': 'ruby',
                    'go': 'go',
                    'java': 'java',
                    'c': 'c',
                    'cpp': 'cpp',
                    'cs': 'csharp',
                    'php': 'php',
                    'html': 'html',
                    'css': 'css',
                    'scss': 'scss',
                    'json': 'json',
                    'yaml': 'yaml',
                    'yml': 'yaml',
                    'md': 'markdown',
                    'sh': 'bash',
                    'bash': 'bash',
                    'shell': 'bash',
                    'sql': 'sql',
                    'text': 'text',
                    'plaintext': 'text',
                    'txt': 'text'
                };
                
                const mappedLanguage = languageMap[language.toLowerCase()] || language;
                
                formattedParts.push(
                    <div key={`code-${i}`} className="my-4 rounded overflow-hidden relative group">
                        <div className="bg-gray-800 text-gray-400 text-xs px-3 py-1 flex justify-between items-center">
                            <span className="font-mono">{mappedLanguage}</span>
                            <button 
                                onClick={() => copyToClipboard(codeContent, codeIndex)}
                                className="ml-2 p-1 rounded transition-all duration-200 hover:bg-gray-700"
                                title="Copy to clipboard"
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
                            language={mappedLanguage}
                            style={atomDark}
                            customStyle={{
                                margin: 0,
                                padding: '0.75rem',
                                borderRadius: '0',
                                fontSize: '0.9rem',
                                lineHeight: '1.4',
                                overflowX: 'auto'
                            }}
                            showLineNumbers={codeContent.split('\n').length > 3}
                            wrapLines={true}
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
        
        // Function to process text formatting (bold, italic, inline code, strikethrough)
        const processTextFormatting = (text: string) => {
            // Process bold text (**text**)
            let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Process italic text (*text*)
            formattedText = formattedText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
            
            // Process inline code (`text`)
            formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm">$1</code>');
            
            // Process strikethrough (~~text~~)
            formattedText = formattedText.replace(/~~(.*?)~~/g, '<del>$1</del>');
            
            // Process links in format [text](url)
            formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${themeClasses.link.replace('underline', 'hover:underline')}">${text}</a>`;
            });
            
            // Return text with HTML tags
            if (formattedText !== text) {
                return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
            }
            
            // Return plain text if no formatting
            return text;
        };
        
        // Process horizontal rule
        const processHorizontalRule = (line: string) => {
            return line.match(/^(\s*[-*_]){3,}\s*$/) !== null;
        };
        
        return (
            <div className="space-y-1">
                {lines.map((line, idx) => {
                    // Check if line is a heading (starts with # or ##)
                    if (line.match(/^#+\s/)) {
                        const headingLevel = line.match(/^(#+)\s/)?.[1].length || 1;
                        const headingText = line.replace(/^#+\s/, '');
                        
                        const headingClasses = [
                            "font-bold text-white", 
                            headingLevel === 1 ? "text-lg mt-4 mb-2" : 
                            headingLevel === 2 ? "text-base mt-3 mb-1" : "mt-2"
                        ].join(' ');
                        
                        return (
                            <div key={idx} className={headingClasses}>
                                {processTextFormatting(headingText)}
                            </div>
                        );
                    }
                    
                    // Check if line is a horizontal rule
                    if (processHorizontalRule(line)) {
                        return <hr key={idx} className="my-3 border-gray-700" />;
                    }
                    
                    // Check if line is a bullet point and determine indentation level
                    // Enhanced regex to catch more bullet point formats including standalone • characters
                    const bulletMatch = line.match(/^(\s*)([-*•]|\d+\.)\s*(.*)/);
                    if (bulletMatch) {
                        const [, indent, bulletType, content] = bulletMatch;
                        const indentLevel = Math.floor(indent.length / 2);
                        const indentClass = `ml-${4 + indentLevel * 4}`;
                        
                        // Handle empty bullet points (just the bullet character)
                        if (!content && bulletType === '•') {
                            return (
                                <div key={idx} className={`flex ${indentClass} mb-1`}>
                                    <span className="mr-3">•</span>
                                    <span></span>
                                </div>
                            );
                        }
                        
                        // Process links in bullet points
                        const parts = content.split(urlPattern);
                        
                        // Determine bullet display (• for all bullet types, or the number for numbered lists)
                        const bulletDisplay = bulletType.match(/\d+\./) ? bulletType : '•';
                        
                        return (
                            <div key={idx} className={`flex ${indentClass} mb-1`}>
                                <span className="mr-3 flex-shrink-0">{bulletDisplay}</span>
                                <span className="flex-1">
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
                                        return <span key={`${idx}-text-${partIdx}`}>{processTextFormatting(part)}</span>;
                                    })}
                                </span>
                            </div>
                        );
                    }
                    
                    // Check if line is a blockquote (starts with >)
                    const quoteMatch = line.match(/^(\s*)>\s*(.*)/);
                    if (quoteMatch) {
                        const [, indent, content] = quoteMatch;
                        const indentLevel = Math.floor(indent.length / 2);
                        const indentClass = `ml-${indentLevel * 4}`;
                        
                        return (
                            <div key={idx} className={`${indentClass} pl-4 border-l-4 border-gray-600 italic text-gray-300 my-2`}>
                                {processTextFormatting(content)}
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
                                return <span key={`${idx}-text-${partIdx}`}>{processTextFormatting(part)}</span>;
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    const handleCommand = (cmd: string) => {
        const command = cmd.trim().toLowerCase();
        const commandParts = command.split(' ');
        
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
                         '• theme    - Show available themes\n' +
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
        } else if (commandParts[0] === 'theme') {
            if (commandParts.length === 1) {
                // Show available themes if no theme specified
                setHistory(prev => [...prev, { 
                    type: 'response', 
                    content: '# Available Themes\n\n' +
                             '• green - Default theme with green text\n' +
                             '• blue  - Cool theme with blue text\n' +
                             '• amber - Warm theme with amber text\n\n' +
                             `Current theme: ${theme}\n\n` +
                             'To change theme, type: theme [color]'
                }]);
                return true;
            } else {
                // Set theme if specified
                const requestedTheme = commandParts[1];
                if (['green', 'blue', 'amber'].includes(requestedTheme)) {
                    setTheme(requestedTheme as ThemeType);
                    setHistory(prev => [...prev, { 
                        type: 'response', 
                        content: `Theme changed to ${requestedTheme}.`
                    }]);
                    return true;
                } else {
                    setHistory(prev => [...prev, { 
                        type: 'error', 
                        content: `Invalid theme: ${requestedTheme}. Available themes: green, blue, amber.`
                    }]);
                    return true;
                }
            }
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
        <div className={`min-h-screen bg-black ${themeClasses.text} p-2 sm:p-4 font-mono flex flex-col`}>
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <Image 
                            src="/logo.svg" 
                            alt="DOX Logo" 
                            width={28} 
                            height={28} 
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
                    <span className={`${themeClasses.text} mr-1`}>●</span> 
                    DOX CLI v1.0.0
                </div>
            </div>
            
            <div className="flex-1 flex flex-col relative">
                <div 
                    ref={terminalRef}
                    className={`flex-1 overflow-auto p-2 sm:p-3 ${themeClasses.bg} rounded border border-gray-700 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900`}
                    onClick={handleTerminalClick}
                >
                    {history.map((item, index) => (
                        <div key={index} className="mb-4 last:mb-2">
                            {item.type === 'command' && (
                                <div className="flex items-start">
                                    <span className={`${themeClasses.prompt} mr-2 flex-shrink-0`}>user@dox:~$ </span> 
                                    <span className="text-white break-words">{item.content}</span>
                                </div>
                            )}
                            {item.type === 'response' && (
                                <div className={`${themeClasses.response} pl-3 sm:pl-4 border-l-2 border-gray-700`}>
                                    {formatResponse(item.content)}
                                </div>
                            )}
                            {item.type === 'error' && (
                                <div className="text-red-400 pl-3 sm:pl-4 border-l-2 border-red-700">
                                    {item.content}
                </div>
            )}
                        </div>
                    ))}
                    
                    {/* Input field inside terminal */}
                    <div className="flex items-start mt-1">
                        <span className={`${themeClasses.prompt} mr-2 flex-shrink-0 mt-0.5`}>user@dox:~$</span>
                        <div className="flex-1 flex items-center relative">
                            <style jsx>{`
                                /* Custom caret styling */
                                input {
                                    caret-color: ${theme === 'green' ? '#4ade80' : theme === 'blue' ? '#60a5fa' : '#fbbf24'};
                                    animation: blink-caret 1s step-end infinite;
                                }
                                
                                @keyframes blink-caret {
                                    from, to { caret-color: ${theme === 'green' ? '#4ade80' : theme === 'blue' ? '#60a5fa' : '#fbbf24'}; }
                                    50% { caret-color: transparent; }
                                }
                                
                                /* Placeholder styling */
                                input::placeholder {
                                    color: ${theme === 'green' ? 'rgba(74, 222, 128, 0.5)' : 
                                             theme === 'blue' ? 'rgba(96, 165, 250, 0.5)' : 
                                             'rgba(251, 191, 36, 0.5)'};
                                    opacity: 0.7;
                                }
                            `}</style>
                            <form onSubmit={handleSubmit} className="w-full">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={loading}
                                    className={`flex-1 bg-transparent ${themeClasses.text} outline-none border-none py-0.5 pl-0.5 w-full font-mono text-base`}
                                    placeholder={loading ? "Processing..." : "Type your question..."}
                                    autoFocus
                                />
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 flex justify-between items-center px-1">
                    <div>Type <span className="text-gray-400">help</span> for available commands</div>
                    <div>{loading ? 'Processing...' : 'Ready'}</div>
                </div>
            </div>
        </div>
    );
} 