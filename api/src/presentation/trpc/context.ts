import { inferAsyncReturnType } from '@trpc/server';
import { ResearchCompetitorsUseCase } from '../../application/usecases/ResearchCompetitorsUseCase.js';
import { DIContainer } from '../../infrastructure/DIContainer.js';

export const createContext = async (container: DIContainer) => {
  return {
    researchCompetitorsUseCase: container.getResearchCompetitorsUseCase(),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;