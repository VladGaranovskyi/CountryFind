export interface Country {
  _id?: string;
  name: string;
  code: string;
  region: string;
  subregion: string;
  population: number;
  gdp: number;
  gdpPerCapita: number;
  area: number;
  languages: string[];
  currencies: string[];
  government: string;
  climate: string;
  geography: string;
  culture: string;
  economy: string;
  embedding?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SimilarityRequest {
  countryId: string;
  limit?: number;
  threshold?: number;
}

export interface SimilarityResult {
  country: Country;
  similarity: number;
}

export interface WorldBankIndicator {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  context?: string;
}