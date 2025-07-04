export interface MarketAnalysisRequest {
  targetCompanyName: string;
  targetCompanyTerms: string[];
  similarCompaniesTerms: Record<string, string[]>;
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