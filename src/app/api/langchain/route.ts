import { NextRequest, NextResponse } from 'next/server';
import { searchAndExplain } from './DocumentationAssistant';
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
        const { query } = body;

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        // Process query without sessionId
        const explanation = await searchAndExplain(query);
        
        return NextResponse.json({ 
            explanation
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