import type { SearchResult } from './Company.js';

export interface MarketAnalysisRequest {
  targetCompanyName: string;
  targetCompanyTerms: string[];
  similarCompaniesTerms: Record<string, string[]>;
  searchResults?: SearchResult[];
}

export interface MarketAnalysisResponse {
  analysisResults: AnalysisResult[];
  relationResults: RelationResult[];
}

export interface AnalysisResult {
  topicTitle: string;
  analysisContent: string;
}

export interface RelationResult {
  similarCompanyName: string;
  specificAnalysisResultBetweenTargetCompany: string;
  recommendationNextActionBetweenTargetCompany: string;
}