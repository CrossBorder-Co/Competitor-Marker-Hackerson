export interface Company {
  id: string;
  name: string;
  keywords: string[];
  recommendationKeywords: string[];
}

export interface CompetitorResearch {
  companyId: string;
  competitorName: string;
  mainProducts: string[];
  keyFeatures: string[];
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  comparisonNotes: string;
  websiteUrl?: string;
  lastUpdated: Date;
}

export interface SearchResult {
  query: string;
  results: SearchResultItem[];
  timestamp: Date;
  language: 'EN' | 'JP';
}

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  content?: string;
}

export interface ResearchOptions {
  language: 'EN' | 'JP';
  mode: 'normal' | 'deep';
  limit: number;
  includeEnvironmentAnalysis?: boolean;
  includeThreatAnalysis?: boolean;
}