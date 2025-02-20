import { NextRequest, NextResponse } from 'next/server';
import { searchAndExplain } from './docSearch';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        const explanation = await searchAndExplain(query);
        return NextResponse.json({ explanation });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
} 