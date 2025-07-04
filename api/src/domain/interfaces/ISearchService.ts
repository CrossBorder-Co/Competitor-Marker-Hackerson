import type { SearchResult, ResearchOptions } from '../models/Company.js';

export interface ISearchService {
  searchCompetitor(companyName: string, options: ResearchOptions): Promise<SearchResult>;
  searchCompanyProducts(companyName: string, options: ResearchOptions): Promise<SearchResult>;
  searchCompanyFeatures(companyName: string, options: ResearchOptions): Promise<SearchResult>;
}
