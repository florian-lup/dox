import { NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'

const grammarFixPrompt = PromptTemplate.fromTemplate(`
Fix any grammar issues in the following text while preserving its meaning and style.
If there are no grammar issues, return the original text unchanged.

Text: {text}

Fixed text:`)

export async function POST(req: Request) {
  try {
    const { text, modelName } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ API key not found')
      return NextResponse.json({ error: 'OpenAI API key not found' }, { status: 500 })
    }

    const model = new ChatOpenAI({
      modelName,
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
      streaming: true,
    })

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string }) => input.text,
      },
      grammarFixPrompt,
      model,
      new StringOutputParser(),
    ])

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // Process the stream
    ;(async () => {
      try {
        for await (const chunk of await chain.stream({ text })) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
        }
      } catch (error) {
        console.error('Stream error:', error)
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`))
      } finally {
        await writer.close()
      }
    })()

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Grammar fix error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}