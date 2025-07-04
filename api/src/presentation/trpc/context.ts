import type { inferAsyncReturnType } from '@trpc/server';
import { ResearchCompetitorsUseCase } from '../../application/usecases/ResearchCompetitorsUseCase.js';
import { DIContainer } from '../../infrastructure/DIContainer.js';

export const createContext = async (container: DIContainer) => {
  return {
    researchCompetitorsUseCase: container.getResearchCompetitorsUseCase(),
    mcpConversationUseCase: container.getMcpConversationUseCase(),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;