// Export services
export * from './services';
// Also explicitly export the searchAndExplain function for direct imports from lib
export { searchAndExplain } from './services/DocumentationAssistant';

// Export utils
export * from './utils/commandProcessor';

// Export types
export * from './types/theme';
export * from './types/terminal';

// Export hooks
export * from './hooks/useTheme';
export * from './hooks/useCommandProcessor';
export * from './hooks/useTerminalHistory';

// Export providers
export * from './providers/ThemeProvider'; 