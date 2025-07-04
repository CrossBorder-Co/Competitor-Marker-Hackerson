import { SearchResult, CompetitorResearch } from '../models/Company.js';

export interface ICacheService {
  getSearchResult(key: string): Promise<SearchResult | null>;
  setSearchResult(key: string, result: SearchResult): Promise<void>;
  getCompetitorResearch(companyId: string, competitorName: string): Promise<CompetitorResearch | null>;
  setCompetitorResearch(companyId: string, competitorName: string, research: CompetitorResearch): Promise<void>;
  generateCacheKey(companyId: string, competitorName: string, searchType: string): string;
}