import type { ICompanyRepository } from '../../domain/interfaces/ICompanyRepository.js';
import type { ISearchService } from '../../domain/interfaces/ISearchService.js';
import type { IAnalysisService } from '../../domain/interfaces/IAnalysisService.js';
import type { ICacheService } from '../../domain/interfaces/ICacheService.js';
import type { CompetitorResearch, ResearchOptions } from '../../domain/models/Company.js';

export class ResearchCompetitorsUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private searchService: ISearchService,
    private analysisService: IAnalysisService,
    private cacheService: ICacheService
  ) {}

  async execute(companyId: string, options: ResearchOptions): Promise<CompetitorResearch[]> {
    console.log(`🔍 Starting competitor research for company ID: ${companyId}`);
    console.log(`📊 Research options: ${JSON.stringify(options)}`);
    
    // 1. Get company information
    console.log(`📋 Looking up company information for ID: ${companyId}`);
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new Error(`Company with ID ${companyId} not found`);
    }
    console.log(`✅ Found company: ${company.name}`);

    // 2. Get list of competitors
    console.log(`🏢 Retrieving competitors for ${company.name}`);
    const allCompetitors = await this.companyRepository.getCompetitors(companyId);
    if (allCompetitors.length === 0) {
      throw new Error(`No competitors found for company ${companyId}`);
    }
    
    // Apply limit
    const competitors = allCompetitors.slice(0, options.limit);
    console.log(`✅ Found ${allCompetitors.length} total competitors, researching ${competitors.length} (limit: ${options.limit})`);
    console.log(`📋 Competitors to research: ${competitors.slice(0, 3).join(', ')}${competitors.length > 3 ? '...' : ''}`);

    // 3. Research each competitor
    const results: CompetitorResearch[] = [];
    const targetCompanyContext = this.buildCompanyContext(company.name, company.keywords);
    console.log(`🎯 Target company context prepared`);

    for (let i = 0; i < competitors.length; i++) {
      const competitorName = competitors[i];
      console.log(`\n🔬 [${i + 1}/${competitors.length}] Researching competitor: ${competitorName}`);
      
      try {
        // Check cache first
        console.log(`💾 Checking cache for ${competitorName}`);
        const cachedResearch = await this.cacheService.getCompetitorResearch(companyId, competitorName!);
        if (cachedResearch) {
          console.log(`✅ Found cached research for ${competitorName} (${cachedResearch.lastUpdated.toISOString()})`);
          results.push(cachedResearch);
          continue;
        }
        console.log(`📝 No cache found, performing new research for ${competitorName}`);

        // Perform new research
        const research = await this.researchCompetitor(
          companyId,
          competitorName!,
          targetCompanyContext,
          options
        );

        // Cache the results
        console.log(`💾 Caching research results for ${competitorName}`);
        await this.cacheService.setCompetitorResearch(companyId, competitorName!, research);
        results.push(research);
        console.log(`✅ Completed research for ${competitorName}`);
      } catch (error) {
        console.error(`❌ Error researching competitor ${competitorName}:`, error);
        // Continue with other competitors
      }
    }

    console.log(`\n🎉 Competitor research completed! Total results: ${results.length}/${competitors.length}`);
    return results;
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
}