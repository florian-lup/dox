'use client';

import { useState, useRef, useEffect } from 'react';

export default function DocumentationAssistant() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<Array<{type: 'command' | 'response' | 'error', content: string}>>([
        { type: 'response', content: 'Welcome to DOX CLI - Documentation Assistant\nType your programming question and press Enter.\nType "clear" to reset the terminal.' }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!input.trim()) return;
        
        // Handle clear command
        if (input.trim().toLowerCase() === 'clear') {
            setHistory([{ type: 'response', content: 'Terminal cleared. What would you like to know?' }]);
            setInput('');
            return;
        }

        // Add command to history
        setHistory(prev => [...prev, { type: 'command', content: input }]);
        
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
                body: JSON.stringify({ query: input }),
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
            setInput('');
        }
    };

    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className="min-h-screen bg-black text-green-400 p-4 font-mono flex flex-col">
            <div className="mb-2 flex items-center">
                <div className="flex space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-gray-400 text-sm">dox@terminal: ~/documentation</div>
            </div>
            
            <div 
                ref={terminalRef}
                className="flex-1 overflow-auto mb-4 p-2 bg-gray-900 rounded border border-gray-700"
                onClick={handleTerminalClick}
            >
                {history.map((item, index) => (
                    <div key={index} className="mb-2">
                        {item.type === 'command' && (
                            <div>
                                <span className="text-blue-400">user@dox:~$</span> <span className="text-white">{item.content}</span>
                            </div>
                        )}
                        {item.type === 'response' && (
                            <div className="text-green-400 whitespace-pre-wrap">{item.content}</div>
                        )}
                        {item.type === 'error' && (
                            <div className="text-red-400">{item.content}</div>
                        )}
                    </div>
                ))}
            </div>
            
            <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-blue-400 mr-2">user@dox:~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1 bg-transparent text-white outline-none border-none"
                    placeholder={loading ? "Processing..." : "Type your question..."}
                    autoFocus
                />
                <span className="animate-pulse text-white">▌</span>
            </form>
        </div>
    );
} 