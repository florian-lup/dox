import { ChatAnthropic } from '@langchain/anthropic';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

// Initialize the Anthropic model
const model = new ChatAnthropic({
    modelName: "claude-3-7-sonnet-20250219",
    temperature: 0.3,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

// Store message histories for different sessions
const sessionHistories = new Map<string, ChatMessageHistory>();

// Create a chat prompt template with a system message and message history
const chatPrompt = ChatPromptTemplate.fromMessages([
    new SystemMessage(
        `You are a helpful programming assistant specializing in documentation. 
Provide clear and concise explanations with practical examples.

Follow these instructions:
1. Explain the key concepts related to the query
2. Provide at least one practical code example
3. Keep the explanation clear and focused
4. Highlight any important considerations or best practices`
    ),
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
]);

// Create the chain
const chain = RunnableSequence.from([
    {
        input: (input) => input.input,
        history: (input) => input.history || [],
    },
    chatPrompt,
    model,
    new StringOutputParser(),
]);

// Default session ID to use when none is provided
const DEFAULT_SESSION_ID = "default_session";

// Get or create message history for a session
function getMessageHistoryForSession(sessionId: string): ChatMessageHistory {
    if (!sessionHistories.has(sessionId)) {
        sessionHistories.set(sessionId, new ChatMessageHistory());
    }
    return sessionHistories.get(sessionId)!;
}

export async function searchAndExplain(query: string, sessionId?: string): Promise<string> {
    try {
        // Validate query
        if (!query || typeof query !== 'string' || query.trim() === '') {
            throw new Error('Invalid or empty query');
        }
        
        // Use the provided session ID or the default one
        // This ensures consistency between requests
        const actualSessionId = sessionId || DEFAULT_SESSION_ID;
        
        // Get the message history for this session
        const messageHistory = getMessageHistoryForSession(actualSessionId);
        
        // Get all previous messages
        const previousMessages = await messageHistory.getMessages();
        
        // Use the chain with the message history
        const response = await chain.invoke({
            input: query,
            history: previousMessages,
        });
        
        // Add the new messages to history
        await messageHistory.addMessage(new HumanMessage(query));
        await messageHistory.addMessage(new AIMessage(response));
        
        return response;
    } catch (error: unknown) {
        console.error("Error in searchAndExplain:", error);
        throw error;
    }
}

// Utility function to clear a session's memory
export function clearSessionMemory(sessionId: string): boolean {
    if (sessionHistories.has(sessionId)) {
        sessionHistories.delete(sessionId);
        return true;
    }
    return false;
}

// Debug utility to get the current state of a session's memory
export async function getSessionMemoryDebug(sessionId: string = DEFAULT_SESSION_ID): Promise<string> {
    if (!sessionHistories.has(sessionId)) {
        return `No memory found for session ${sessionId}`;
    }
    
    const messageHistory = sessionHistories.get(sessionId)!;
    const messages = await messageHistory.getMessages();
    
    return JSON.stringify(
        messages.map(msg => ({
            type: msg._getType(),
            content: msg.content.toString().substring(0, 100) + (msg.content.toString().length > 100 ? '...' : '')
        })),
        null,
        2
    );
}

// Utility to list all active sessions
export function listActiveSessions(): string[] {
    return Array.from(sessionHistories.keys());
} 