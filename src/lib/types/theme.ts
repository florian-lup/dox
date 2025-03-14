export type ThemeType = 'green' | 'blue' | 'amber';

export interface ThemeColors {
  text: string;
  bg: string;
  prompt: string;
  response: string;
  highlight: string;
  link: string;
  scrollbarThumb: string;
  commandBg: string;
}

export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
} 