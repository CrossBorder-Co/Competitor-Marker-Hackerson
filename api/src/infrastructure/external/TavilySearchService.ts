import type { ISearchService } from '../../domain/interfaces/ISearchService.js';
import type { SearchResult, SearchResultItem, ResearchOptions } from '../../domain/models/Company.js';
import fetch from 'node-fetch';

export class TavilySearchService implements ISearchService {
  private apiKey: string;
  private baseUrl = 'https://api.tavily.com/search';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchCompetitor(companyName: string, options: ResearchOptions): Promise<SearchResult> {
    const query = this.buildCompetitorQuery(companyName, options.language);
    return this.performSearch(query, options);
  }

  async searchCompanyProducts(companyName: string, options: ResearchOptions): Promise<SearchResult> {
    const query = this.buildProductsQuery(companyName, options.language);
    return this.performSearch(query, options);
  }

  async searchCompanyFeatures(companyName: string, options: ResearchOptions): Promise<SearchResult> {
    const query = this.buildFeaturesQuery(companyName, options.language);
    return this.performSearch(query, options);
  }

  private buildCompetitorQuery(companyName: string, language: 'EN' | 'JP'): string {
    if (language === 'JP') {
      return `${companyName} 会社情報 事業内容 サービス 製品`;
    }
    return `${companyName} company information business services products`;
  }

  private buildProductsQuery(companyName: string, language: 'EN' | 'JP'): string {
    if (language === 'JP') {
      return `${companyName} 製品 サービス 特徴 機能`;
    }
    return `${companyName} products services features capabilities`;
  }

  private buildFeaturesQuery(companyName: string, language: 'EN' | 'JP'): string {
    if (language === 'JP') {
      return `${companyName} 特徴 強み 優位性 技術`;
    }
    return `${companyName} features strengths advantages technology`;
  }

  private async performSearch(query: string, options: ResearchOptions): Promise<SearchResult> {
    console.log(`      🔍 Tavily search: "${query}" (${options.mode} mode)`);
    
    try {
      const requestBody = {
        query,
        search_depth: options.mode === 'deep' ? 'advanced' : 'basic',
        include_answer: true,
        include_raw_content: true,
        max_results: options.mode === 'deep' ? 10 : 5,
        include_domains: [],
        exclude_domains: [],
      };
      
      console.log(`      📡 Making API request to Tavily (max_results: ${requestBody.max_results})`);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`      ❌ Tavily API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      console.log(`      📊 Tavily response received (${data.results?.length || 0} results)`);
      
      const results: SearchResultItem[] = data.results?.map((item: any) => ({
        title: item.title,
        url: item.url,
        snippet: item.content || item.snippet,
        content: item.raw_content,
      })) || [];

      console.log(`      ✅ Search completed: ${results.length} results processed`);

      return {
        query,
        results,
        timestamp: new Date(),
        language: options.language,
      };
    } catch (error) {
      console.error(`      ❌ Search error for query "${query}":`, error);
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}