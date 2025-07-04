import type { inferAsyncReturnType } from '@trpc/server';
import { ResearchCompetitorsUseCase } from '../../application/usecases/ResearchCompetitorsUseCase.js';
import { MarketAnalysisUseCase } from '../../application/usecases/MarketAnalysisUseCase.js';
import { ArticleGenerationUseCase } from '../../application/usecases/ArticleGenerationUseCase.js';
import { DIContainer } from '../../infrastructure/DIContainer.js';

export const createContext = async (container: DIContainer) => {
  return {
    researchCompetitorsUseCase: container.getResearchCompetitorsUseCase(),
    marketAnalysisUseCase: container.getMarketAnalysisUseCase(),
    articleGenerationUseCase: container.getArticleGenerationUseCase(),
    mcpConversationUseCase: container.getMcpConversationUseCase(),
    graphCompanyRevenuesUseCase: container.getGraphCompanyRevenuesUseCase(),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;