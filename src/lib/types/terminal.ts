export interface HistoryItem {
  type: 'command' | 'response' | 'error';
  content: string;
}

export interface TerminalContainerProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onNonCommandInput?: (commandText: string) => void;
}

export interface CodeBlockProps {
  language: string;
  code: string;
  codeIndex: number;
  copiedCode: number | null;
  onCopy: (text: string, index: number) => void;
} 