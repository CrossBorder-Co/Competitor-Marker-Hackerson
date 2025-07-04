import type { ICompanyRepository } from '../domain/interfaces/ICompanyRepository.js';
import type { ISearchService } from '../domain/interfaces/ISearchService.js';
import type { IAnalysisService } from '../domain/interfaces/IAnalysisService.js';
import type { ICacheService } from '../domain/interfaces/ICacheService.js';
import type { IMarketAnalysisService } from '../domain/interfaces/IMarketAnalysisService.js';
import type { IArticleGenerationService } from '../domain/interfaces/IArticleGenerationService.js';
import { ResearchCompetitorsUseCase } from '../application/usecases/ResearchCompetitorsUseCase.js';
import { MarketAnalysisUseCase } from '../application/usecases/MarketAnalysisUseCase.js';
import { ArticleGenerationUseCase } from '../application/usecases/ArticleGenerationUseCase.js';
import { InMemoryCompanyRepository } from './InMemoryCompanyRepository.js';
import { TavilySearchService } from './external/TavilySearchService.js';
import { OpenAIAnalysisService } from './external/OpenAIAnalysisService.js';
import { OpenAIMarketAnalysisService } from './external/OpenAIMarketAnalysisService.js';
import { OpenAIArticleGenerationService } from './external/OpenAIArticleGenerationService.js';
import { FileCacheService } from './cache/FileCacheService.js';
import type { IMcpService } from '../domain/interfaces/IMcpService.js';
import { McpConversationUseCase } from '../application/usecases/McpConversationUseCase.js';

export interface DIConfig {
  tavilyApiKey: string;
  openaiApiKey: string;
  cacheDir?: string;
  cacheTtlHours?: number;
  mcpServerUrl?: string;
}

export class DIContainer {
  private companyRepository: ICompanyRepository;
  private searchService: ISearchService;
  private analysisService: IAnalysisService;
  private marketAnalysisService: IMarketAnalysisService;
  private articleGenerationService: IArticleGenerationService;
  private cacheService: ICacheService;
  private researchCompetitorsUseCase: ResearchCompetitorsUseCase;
  private marketAnalysisUseCase: MarketAnalysisUseCase;
  private articleGenerationUseCase: ArticleGenerationUseCase;
  private mcpConversationUseCase: McpConversationUseCase;

  constructor(config: DIConfig) {
    // Initialize services
    this.companyRepository = new InMemoryCompanyRepository();
    this.searchService = new TavilySearchService(config.tavilyApiKey);
    this.analysisService = new OpenAIAnalysisService(config.openaiApiKey);
    this.marketAnalysisService = new OpenAIMarketAnalysisService(config.openaiApiKey);
    this.articleGenerationService = new OpenAIArticleGenerationService(config.openaiApiKey);
    this.cacheService = new FileCacheService(config.cacheDir, config.cacheTtlHours);



    // Initialize use cases
    this.researchCompetitorsUseCase = new ResearchCompetitorsUseCase(
      this.companyRepository,
      this.searchService,
      this.analysisService,
      this.cacheService,
      this.marketAnalysisService
    );
    
    this.marketAnalysisUseCase = new MarketAnalysisUseCase(
      this.companyRepository,
      this.marketAnalysisService
    );
    
    this.articleGenerationUseCase = new ArticleGenerationUseCase(
      this.researchCompetitorsUseCase,
      this.articleGenerationService,
      this.cacheService
    );
    
    this.mcpConversationUseCase = new McpConversationUseCase();
  }

  getCompanyRepository(): ICompanyRepository {
    return this.companyRepository;
  }

  getSearchService(): ISearchService {
    return this.searchService;
  }

  getAnalysisService(): IAnalysisService {
    return this.analysisService;
  }

  getCacheService(): ICacheService {
    return this.cacheService;
  }

  getResearchCompetitorsUseCase(): ResearchCompetitorsUseCase {
    return this.researchCompetitorsUseCase;
  }

  getMarketAnalysisService(): IMarketAnalysisService {
    return this.marketAnalysisService;
  }

  getMarketAnalysisUseCase(): MarketAnalysisUseCase {
    return this.marketAnalysisUseCase;
  }

  getArticleGenerationUseCase(): ArticleGenerationUseCase {
    return this.articleGenerationUseCase;
  }

  getMcpConversationUseCase(): McpConversationUseCase {
    return this.mcpConversationUseCase;
  }
}