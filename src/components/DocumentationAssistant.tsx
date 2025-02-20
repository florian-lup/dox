'use client';

import { useState } from 'react';

export default function DocumentationAssistant() {
    const [query, setQuery] = useState('');
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setExplanation('');

        try {
            const response = await fetch('/api/langchain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get explanation');
            }

            setExplanation(data.explanation);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Programming Documentation Assistant</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div>
                    <label htmlFor="query" className="block text-sm font-medium mb-2">
                        What would you like to learn about?
                    </label>
                    <textarea
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full p-3 border rounded-lg min-h-[100px]"
                        placeholder="Enter your programming question (e.g., 'How do React hooks work?')"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Get Explanation'}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {explanation && (
                <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold mb-4">Explanation</h2>
                    <div className="p-6 bg-gray-50 rounded-lg whitespace-pre-wrap">
                        {explanation}
                    </div>
                </div>
            )}
        </main>
    );
} 