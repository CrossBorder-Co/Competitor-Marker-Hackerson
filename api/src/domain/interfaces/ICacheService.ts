import type { SearchResult, CompetitorResearch } from '../models/Company.js';
import type { MarketAnalysisResponse } from '../models/MarketAnalysis.js';

export interface ICacheService {
  getSearchResult(key: string): Promise<SearchResult | null>;
  setSearchResult(key: string, result: SearchResult): Promise<void>;
  getCompetitorResearch(companyId: string, competitorName: string): Promise<CompetitorResearch | null>;
  setCompetitorResearch(companyId: string, competitorName: string, research: CompetitorResearch): Promise<void>;
  getMarketAnalysis(companyId: string, analysisType: 'environment' | 'threat'): Promise<MarketAnalysisResponse | null>;
  setMarketAnalysis(companyId: string, analysisType: 'environment' | 'threat', analysis: MarketAnalysisResponse): Promise<void>;
  generateCacheKey(companyId: string, competitorName: string, searchType: string): string;
  generateMarketAnalysisCacheKey(companyId: string, analysisType: 'environment' | 'threat'): string;
}