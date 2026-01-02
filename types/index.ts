export type SortearType = 'names' | 'numbers' | 'sequence' | 'groups'; 

export interface Name {
  id: string;
  value: string;
}

export interface SavedList {
  id: string;
  title: string;
  names: string[]; // Array de strings (os nomes)
  createdAt: number;
}

export interface SortearResult {
  type: SortearType;
  result: string[] | number[];
  timestamp: number;
}

export interface SortearConfig {
  allowRepetition: boolean;
  quantity: number;
  minValue?: number;
  maxValue?: number;
  sequenceLength?: number;
}

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
}   