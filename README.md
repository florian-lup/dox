# DOX CLI - Intelligent Documentation Assistant

DOX CLI is a modern web-based terminal interface that provides intelligent documentation assistance for programming and technical concepts. It leverages Anthropic's Claude 3.7 Sonnet model to generate comprehensive, practical documentation on demand.

## Features

- **Interactive Terminal Interface**: Clean, responsive terminal-like experience in the browser
- **Intelligent Documentation**: Get detailed explanations for any programming concept
- **Structured Responses**: Consistent format with concept overviews, examples, pitfalls, and best practices
- **Code Examples**: Practical code snippets for both beginners and advanced users

## Technology Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: LangChain, Anthropic Claude 3.7 Sonnet

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- An Anthropic API key

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

3. Create a `.env.local` file in the root directory with your API keys:

   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use DOX CLI.

## Usage

- Type `help` in the terminal to see available commands
- Ask any programming question directly (e.g., "Explain React hooks with examples")
- Press `Ctrl+C` to cancel a request in progress
- Use the theme switcher to toggle between light and dark modes

## Deployment

This application is configured for easy deployment on Vercel:

```bash
npm run build
vercel deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
