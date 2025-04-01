import { ChatAnthropic } from '@langchain/anthropic';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { SystemMessage } from "@langchain/core/messages";

// System prompt for Claude
const SYSTEM_PROMPT = `You are an expert documentation assistant specializing in programming and technical concepts.
Your goal is to provide clear, comprehensive, and practical documentation that helps developers understand and implement concepts quickly.

RESPONSE STRUCTURE:
1. CONCEPT OVERVIEW - Start with a concise explanation of the core concept or technology
2. KEY COMPONENTS - Break down the important elements, classes, or functions
3. CODE EXAMPLES - Provide at least two practical examples:
   - A simple "getting started" example for beginners
   - A more advanced implementation showing best practices
4. COMMON PITFALLS - Highlight potential issues and how to avoid them
5. BEST PRACTICES - Provide specific recommendations for optimal implementation
6. RESOURCES - Suggest official documentation or helpful community resources when relevant

GUIDELINES:
- Adapt your explanation to the technical level implied by the query
- Use consistent syntax highlighting and code formatting
- Explain code examples line by line when complexity warrants it
- When multiple approaches exist, briefly compare them and recommend the most appropriate one
- If a query is ambiguous, focus on the most common interpretation but acknowledge alternatives
- For language-specific queries, maintain consistent use of that language in examples
- Balance brevity with completeness - prioritize information most relevant to implementation

Remember to format all code blocks properly with appropriate language syntax highlighting.`;

export async function searchAndExplain(query: string): Promise<string> {
    try {
        // Validate query
        if (!query || typeof query !== 'string' || query.trim() === '') {
            throw new Error('Invalid or empty query');
        }
        
        // Since this code might run on both client and server, we need to ensure
        // we only initialize the model on the server where the API key is available
        if (typeof window !== 'undefined') {
            throw new Error('This function can only be executed from server-side code');
        }
        
        // Initialize the Anthropic model (only on server-side)
        const model = new ChatAnthropic({
            modelName: "claude-3-7-sonnet-20250219",
            temperature: 0,
            anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        });
        
        // Create a chat prompt template with a system message
        const chatPrompt = ChatPromptTemplate.fromMessages([
            new SystemMessage(SYSTEM_PROMPT),
            ["human", "{input}"],
        ]);
        
        // Create the chain
        const chain = RunnableSequence.from([
            {
                input: (input) => input.input,
            },
            chatPrompt,
            model,
            new StringOutputParser(),
        ]);
        
        // Use the chain without maintaining message history
        const response = await chain.invoke({
            input: query,
        });
        
        return response;
    } catch (error: unknown) {
        console.error("Error in searchAndExplain:", error);
        throw error;
    }
} 