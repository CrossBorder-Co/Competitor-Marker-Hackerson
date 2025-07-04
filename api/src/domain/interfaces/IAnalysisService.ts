import { SearchResult, CompetitorResearch, ResearchOptions } from '../models/Company.js';

export interface IAnalysisService {
  analyzeCompetitor(
    competitorName: string,
    searchResults: SearchResult[],
    targetCompanyContext: string,
    options: ResearchOptions
  ): Promise<CompetitorResearch>;
}