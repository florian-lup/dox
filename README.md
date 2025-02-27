# DOX - AI-Powered Documentation Assistant

DOX is a modern CLI-style web application that helps developers find programming documentation and explanations using AI. Built with Next.js and powered by Claude 3.5 Sonnet via Anthropic's API, DOX provides clear, concise answers to your programming questions with practical code examples.

![DOX CLI Interface](https://via.placeholder.com/800x400?text=DOX+CLI+Interface)

## Features

- **Terminal-like Interface**: Familiar command-line experience in your browser
- **AI-Powered Responses**: Get detailed explanations with code examples for your programming questions
- **Syntax Highlighting**: Code snippets with proper syntax highlighting for better readability
- **Theme Options**: Choose between green, blue, and amber themes
- **Copy to Clipboard**: Easily copy code snippets with a single click
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **AI Integration**: LangChain, Anthropic Claude 3.5 Sonnet
- **Search**: Tavily Search API for retrieving relevant documentation
- **Syntax Highlighting**: React Syntax Highlighter

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- API keys for:
  - Anthropic (Claude)
  - Tavily Search

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dox.git
   cd dox
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Type your programming question in the terminal input and press Enter
2. DOX will search for relevant documentation and provide an AI-generated explanation
3. Use the following commands:
   - `help` - Display available commands
   - `clear` - Clear the terminal
   - `theme [green|blue|amber]` - Change the terminal theme

## Deployment

The easiest way to deploy DOX is using [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the environment variables
4. Deploy

## License

[MIT](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org)
- [Anthropic Claude](https://www.anthropic.com)
- [LangChain](https://js.langchain.com)
- [Tavily Search API](https://tavily.com)
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
