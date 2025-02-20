import { ChatAnthropic } from '@langchain/anthropic';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

// Initialize the models and tools
const model = new ChatAnthropic({
    modelName: "claude-3-5-sonnet-20241022",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

const searchTool = new TavilySearchResults({
    apiKey: process.env.TAVILY_API_KEY,
    maxResults: 5,
    searchDepth: "deep",
});

// Create prompt template for generating explanations
const explanationPrompt = PromptTemplate.fromTemplate(`
You are a helpful programming assistant. Based on the following search results about {query}, 
provide a clear and concise explanation with practical examples.

Search Results:
{searchResults}

Instructions:
1. Summarize the key concepts
2. Provide at least one practical code example
3. Keep the explanation clear and focused
4. Highlight any important considerations or best practices

Explanation:
`);

// Create the chain
const chain = RunnableSequence.from([
    {
        searchResults: async (input: { query: string }) => {
            try {
                const results = await searchTool.invoke(input.query);
                // Parse results if they're returned as a string
                const parsedResults = typeof results === 'string' ? JSON.parse(results) : results;
                
                if (Array.isArray(parsedResults)) {
                    // Extract content from each result and join
                    return parsedResults
                        .filter(r => r && r.content)  // Filter out any invalid results
                        .map(r => `${r.title}\n${r.content}`)
                        .join('\n\n');
                } else {
                    console.error('Unexpected results structure:', parsedResults);
                    return 'No relevant results found.';
                }
            } catch (error) {
                console.error('Error processing search results:', error);
                throw error;
            }
        },
        query: (input: { query: string }) => input.query,
    },
    explanationPrompt,
    model,
    new StringOutputParser(),
]);

export async function searchAndExplain(query: string) {
    try {
        const result = await chain.invoke({
            query,
        });
        return result;
    } catch (error) {
        console.error("Error in searchAndExplain:", error);
        throw error;
    }
} 