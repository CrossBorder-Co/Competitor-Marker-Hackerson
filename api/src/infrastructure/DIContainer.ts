import type { ICompanyRepository } from '../domain/interfaces/ICompanyRepository.js';
import type { ISearchService } from '../domain/interfaces/ISearchService.js';
import type { IAnalysisService } from '../domain/interfaces/IAnalysisService.js';
import type { ICacheService } from '../domain/interfaces/ICacheService.js';
import type { IMcpService } from '../domain/interfaces/IMcpService.js';
import { ResearchCompetitorsUseCase } from '../application/usecases/ResearchCompetitorsUseCase.js';
import { McpConversationUseCase } from '../application/usecases/McpConversationUseCase.js';
import { InMemoryCompanyRepository } from './InMemoryCompanyRepository.js';
import { TavilySearchService } from './external/TavilySearchService.js';
import { OpenAIAnalysisService } from './external/OpenAIAnalysisService.js';
import { McpService } from './external/McpService.js';
import { McpConversationService } from './external/McpConversationService.js';
import { FileCacheService } from './services/FileCacheService.js';

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
  private cacheService: ICacheService;
  private mcpService: IMcpService;
  private mcpConversationService: McpConversationService;
  private researchCompetitorsUseCase: ResearchCompetitorsUseCase;
  private mcpConversationUseCase: McpConversationUseCase;

  constructor(config: DIConfig) {
    // Initialize services
    this.companyRepository = new InMemoryCompanyRepository();
    this.searchService = new TavilySearchService(config.tavilyApiKey);
    this.analysisService = new OpenAIAnalysisService(config.openaiApiKey);
    this.cacheService = new FileCacheService(config.cacheDir || './cache', config.cacheTtlHours);
    this.mcpService = new McpService(config.mcpServerUrl);
    this.mcpConversationService = new McpConversationService(config.openaiApiKey, this.mcpService);

    // Initialize use cases
    this.researchCompetitorsUseCase = new ResearchCompetitorsUseCase(
      this.companyRepository,
      this.searchService,
      this.analysisService,
      this.cacheService
    );
    
    this.mcpConversationUseCase = new McpConversationUseCase(
      this.mcpConversationService,
      this.cacheService
    );
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

  getMcpConversationUseCase(): McpConversationUseCase {
    return this.mcpConversationUseCase;
  }
}
