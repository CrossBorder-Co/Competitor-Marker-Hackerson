import type { ICompanyRepository } from '../../domain/interfaces/ICompanyRepository.js';
import type { ISearchService } from '../../domain/interfaces/ISearchService.js';
import type { IAnalysisService } from '../../domain/interfaces/IAnalysisService.js';
import type { ICacheService } from '../../domain/interfaces/ICacheService.js';
import type { IMarketAnalysisService } from '../../domain/interfaces/IMarketAnalysisService.js';
import type { CompetitorResearch, ResearchOptions } from '../../domain/models/Company.js';
import type { MarketAnalysisResponse } from '../../domain/models/MarketAnalysis.js';

export interface ResearchCompetitorsResponse {
  competitorResearch: CompetitorResearch[];
  environmentAnalysis?: MarketAnalysisResponse;
  threatAnalysis?: MarketAnalysisResponse;
}

export class ResearchCompetitorsUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private searchService: ISearchService,
    private analysisService: IAnalysisService,
    private cacheService: ICacheService,
    private marketAnalysisService: IMarketAnalysisService
  ) {}

  async execute(companyKeyword: string, options: ResearchOptions): Promise<ResearchCompetitorsResponse> {
    console.log(`🔍 Starting competitor research for company keyword: ${companyKeyword}`);
    console.log(`📊 Research options: ${JSON.stringify(options)}`);
    
    // 1. Get company information by keyword (ID first, then name)
    console.log(`📋 Looking up company information for keyword: ${companyKeyword}`);
    const company = await this.companyRepository.findByKeyword(companyKeyword);
    if (!company) {
      throw new Error(`Company with keyword ${companyKeyword} not found`);
    }
    console.log(`✅ Found company: ${company.name}`);

    // 2. Get list of competitors
    console.log(`🏢 Retrieving competitors for ${company.name}`);
    const allCompetitors = await this.companyRepository.getCompetitors(company.id);
    if (allCompetitors.length === 0) {
      throw new Error(`No competitors found for company ${company.name}`);
    }
    
    // Apply limit
    const competitors = allCompetitors.slice(0, options.limit);
    console.log(`✅ Found ${allCompetitors.length} total competitors, researching ${competitors.length} (limit: ${options.limit})`);
    console.log(`📋 Competitors to research: ${competitors.slice(0, 3).join(', ')}${competitors.length > 3 ? '...' : ''}`);

    // 3. Research each competitor in parallel
    const targetCompanyContext = this.buildCompanyContext(company.name, company.keywords);
    console.log(`🎯 Target company context prepared`);
    console.log(`🚀 Starting parallel research for ${competitors.length} competitors...`);

    // Create parallel research tasks
    const researchTasks = competitors.map(async (competitorName, index) => {
      const competitorNumber = index + 1;
      console.log(`🔬 [${competitorNumber}/${competitors.length}] Starting research for: ${competitorName}`);
      
      try {
        // Check cache first
        console.log(`💾 [${competitorNumber}] Checking cache for ${competitorName}`);
        const cachedResearch = await this.cacheService.getCompetitorResearch(company.id, competitorName!);
        if (cachedResearch) {
          console.log(`✅ [${competitorNumber}] Found cached research for ${competitorName} (${cachedResearch.lastUpdated.toISOString()})`);
          return cachedResearch;
        }
        console.log(`📝 [${competitorNumber}] No cache found, performing new research for ${competitorName}`);

        // Perform new research
        const research = await this.researchCompetitor(
          company.id,
          competitorName!,
          targetCompanyContext,
          options
        );

        // Cache the results
        console.log(`💾 [${competitorNumber}] Caching research results for ${competitorName}`);
        await this.cacheService.setCompetitorResearch(company.id, competitorName!, research);
        console.log(`✅ [${competitorNumber}] Completed research for ${competitorName}`);
        return research;
      } catch (error) {
        console.error(`❌ [${competitorNumber}] Error researching competitor ${competitorName}:`, error);
        return null; // Return null for failed research
      }
    });

    // Execute all research tasks in parallel
    const researchResults = await Promise.all(researchTasks);
    
    // Filter out null results (failed research)
    const results: CompetitorResearch[] = researchResults.filter((result): result is CompetitorResearch => result !== null);

    console.log(`\n🎉 Competitor research completed! Total results: ${results.length}/${competitors.length}`);
    
    // 3. Perform market analysis if requested
    const response: ResearchCompetitorsResponse = {
      competitorResearch: results
    };
    
    if (options.includeEnvironmentAnalysis) {
      console.log(`\n🌍 Starting environment analysis for ${company.name}`);
      // Check cache first
      const cachedEnvironmentAnalysis = await this.cacheService.getMarketAnalysis(company.id, 'environment');
      if (cachedEnvironmentAnalysis) {
        console.log(`✅ Found cached environment analysis for ${company.name}`);
        response.environmentAnalysis = cachedEnvironmentAnalysis;
      } else {
        console.log(`📝 No cache found, performing new environment analysis for ${company.name}`);
        response.environmentAnalysis = await this.performMarketAnalysis(company, 'environment');
        // Cache the results
        await this.cacheService.setMarketAnalysis(company.id, 'environment', response.environmentAnalysis);
        console.log(`✅ Environment analysis completed and cached`);
      }
    }
    
    if (options.includeThreatAnalysis) {
      console.log(`\n⚠️ Starting threat analysis for ${company.name}`);
      // Check cache first
      const cachedThreatAnalysis = await this.cacheService.getMarketAnalysis(company.id, 'threat');
      if (cachedThreatAnalysis) {
        console.log(`✅ Found cached threat analysis for ${company.name}`);
        response.threatAnalysis = cachedThreatAnalysis;
      } else {
        console.log(`📝 No cache found, performing new threat analysis for ${company.name}`);
        response.threatAnalysis = await this.performMarketAnalysis(company, 'threat');
        // Cache the results
        await this.cacheService.setMarketAnalysis(company.id, 'threat', response.threatAnalysis);
        console.log(`✅ Threat analysis completed and cached`);
      }
    }
    
    return response;
  }

  private async researchCompetitor(
    companyId: string,
    competitorName: string,
    targetCompanyContext: string,
    options: ResearchOptions
  ): Promise<CompetitorResearch> {
    console.log(`    🔍 Starting web searches for ${competitorName}`);
    
    // 1. Perform searches
    const searchTypes = ['general info', 'products', 'features'];
    const searchTasks = [
      this.searchService.searchCompetitor(competitorName, options),
      this.searchService.searchCompanyProducts(competitorName, options),
      this.searchService.searchCompanyFeatures(competitorName, options),
    ];

    console.log(`    🌐 Executing ${searchTasks.length} parallel searches...`);
    const searchResults = await Promise.all(searchTasks);
    console.log(`    ✅ All searches completed for ${competitorName}`);

    // Cache search results
    console.log(`    💾 Caching search results...`);
    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      const searchType = searchTypes[i];
      if (result) {
        const cacheKey = this.cacheService.generateCacheKey(
          companyId,
          competitorName,
          result.query.includes('製品') || result.query.includes('products') ? 'products' : 
          result.query.includes('特徴') || result.query.includes('features') ? 'features' : 'general'
        );
        await this.cacheService.setSearchResult(cacheKey, result);
        console.log(`    💾 Cached ${searchType} search (${result.results.length} results)`);
      }
    }

    // 2. Analyze the search results
    console.log(`    🤖 Starting AI analysis for ${competitorName}...`);
    const totalResults = searchResults.reduce((sum, r) => sum + r.results.length, 0);
    console.log(`    📊 Analyzing ${totalResults} search results total`);
    
    const research = await this.analysisService.analyzeCompetitor(
      competitorName,
      searchResults,
      targetCompanyContext,
      options
    );

    console.log(`    ✅ AI analysis completed for ${competitorName}`);
    console.log(`    📋 Generated analysis with ${research.mainProducts.length} products, ${research.keyFeatures.length} features`);

    // Set the company ID
    research.companyId = companyId;

    return research;
  }

  private buildCompanyContext(companyName: string, keywords: string[]): string {
    return `会社名: ${companyName}\n主要事業・キーワード:\n${keywords.map(k => `- ${k}`).join('\n')}`;
  }

  private async performMarketAnalysis(company: any, type: 'environment' | 'threat'): Promise<MarketAnalysisResponse> {
    // Get competitor companies and their keywords
    const competitors = await this.companyRepository.getCompetitors(company.id);
    
    const similarCompaniesTerms: Record<string, string[]> = {};
    for (const competitorName of competitors) {
      const competitorCompany = await this.companyRepository.findByName(competitorName);
      if (competitorCompany) {
        similarCompaniesTerms[competitorName] = competitorCompany.keywords;
      }
    }

    // Perform web searches for market analysis
    console.log(`🔍 Performing web searches for ${type} analysis...`);
    const searchResults = await this.performMarketSearches(company, type);
    console.log(`✅ Completed ${searchResults.length} web searches for ${type} analysis`);

    const request = {
      targetCompanyName: company.name,
      targetCompanyTerms: company.keywords,
      similarCompaniesTerms,
      searchResults,
    };

    if (type === 'environment') {
      return await this.marketAnalysisService.analyzeMarketEnvironment(request);
    } else {
      return await this.marketAnalysisService.analyzeThreatEnvironment(request);
    }
  }

  private async performMarketSearches(company: any, type: 'environment' | 'threat'): Promise<SearchResult[]> {
    const options = { language: 'JP' as const, mode: 'normal' as const, limit: 10 };

    try {
      let queries: string[] = [];
      
      if (type === 'environment') {
        // Search for market environment information
        queries = [
          `${company.name} 市場環境 業界動向`,
          `${company.name} 市場規模 成長性`,
          `${company.name} 業界 競争環境`,
          `${company.name} 顧客セグメント`,
        ];
      } else {
        // Search for threat analysis information
        queries = [
          `${company.name} 競合他社 脅威`,
          `${company.name} 市場 新規参入`,
          `${company.name} 業界 リスク`,
          `${company.name} 競争優位性`,
        ];
      }

      console.log(`🚀 Starting ${queries.length} parallel searches for ${type} analysis...`);

      // Perform all searches in parallel
      const searchTasks = queries.map(async (query, index) => {
        try {
          console.log(`🔍 [${index + 1}/${queries.length}] Searching: ${query}`);
          const result = await this.searchService.search(query, options);
          if (result && result.results.length > 0) {
            console.log(`✅ [${index + 1}/${queries.length}] Found ${result.results.length} results for: ${query}`);
            return result;
          } else {
            console.log(`📭 [${index + 1}/${queries.length}] No results for: ${query}`);
            return null;
          }
        } catch (error) {
          console.warn(`⚠️ [${index + 1}/${queries.length}] Search failed for query: ${query}`, error);
          return null;
        }
      });

      const searchResults = await Promise.all(searchTasks);
      
      // Filter out null results
      const validResults = searchResults.filter((result): result is SearchResult => result !== null);
      console.log(`✅ Completed ${type} searches: ${validResults.length}/${queries.length} successful`);
      
      return validResults;
    } catch (error) {
      console.error(`❌ Error performing market searches for ${type}:`, error);
      return [];
    }
  }
}