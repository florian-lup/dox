import { NextRequest, NextResponse } from 'next/server';
import { searchAndExplain, clearSessionMemory } from './docSearch';
import { AxiosError } from 'axios';

// Validate environment variables
const validateEnv = () => {
    if (!process.env.ANTHROPIC_API_KEY) {
        return false;
    }
    return true;
};

export async function POST(req: NextRequest) {
    try {
        // Check environment variables
        if (!validateEnv()) {
            return NextResponse.json(
                { error: 'Server configuration error: Missing Anthropic API key' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { query, sessionId, action } = body;

        // Handle clear memory action
        if (action === 'clearMemory' && sessionId) {
            const cleared = clearSessionMemory(sessionId);
            return NextResponse.json({ 
                success: cleared, 
                message: cleared ? 'Session memory cleared' : 'Session not found' 
            });
        }

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        // Pass the sessionId to maintain conversation context
        const explanation = await searchAndExplain(query, sessionId);
        
        // Generate a new sessionId if one wasn't provided
        const responseSessionId = sessionId || `session_${Date.now()}`;
        
        return NextResponse.json({ 
            explanation, 
            sessionId: responseSessionId 
        });
    } catch (error: unknown) {
        console.error('Error processing request:', error);
        
        // Handle specific error types
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || error.message || 'API request failed';
            
            return NextResponse.json(
                { error: message },
                { status }
            );
        }
        
        // Handle generic errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
} 