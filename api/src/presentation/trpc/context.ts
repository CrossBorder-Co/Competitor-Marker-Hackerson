import type { inferAsyncReturnType } from '@trpc/server';
import type { DIContainer } from '../../infrastructure/DIContainer.js';

export const createContext = async (container: DIContainer) => {
  return {
    container,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
